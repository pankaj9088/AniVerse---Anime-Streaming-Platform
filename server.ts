import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'aniverse_super_secure_jwt_secret_2026';

app.use(express.json());

// Ensure upload directories exist for authorized video & thumbnail storage
const uploadsDir = path.join(__dirname, 'uploads');
const videoUploadsDir = path.join(uploadsDir, 'videos');
const thumbUploadsDir = path.join(uploadsDir, 'thumbnails');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(videoUploadsDir)) fs.mkdirSync(videoUploadsDir, { recursive: true });
if (!fs.existsSync(thumbUploadsDir)) fs.mkdirSync(thumbUploadsDir, { recursive: true });

// Serve uploaded video and thumbnail assets statically
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, videoUploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `video_${Date.now()}_${cleanName}${ext}`);
  }
});

const thumbStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, thumbUploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `thumb_${Date.now()}_${cleanName}${ext}`);
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB video upload support
});

const uploadThumb = multer({
  storage: thumbStorage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB thumbnail support
});

// In-Memory Database for Users & Admins (Passwords securely hashed with bcrypt)
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Initial Admin & User credentials setup with secure bcrypt hashing
const INITIAL_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';
const INITIAL_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aniverse.com';

const usersDb: StoredUser[] = [
  {
    id: 'admin-001',
    name: 'Pankaj (Super Admin)',
    email: INITIAL_ADMIN_EMAIL.toLowerCase(),
    passwordHash: bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-002',
    name: 'System Admin',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('Admin@1234', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-001',
    name: 'Pankaj Kumar Sah',
    email: 'user@example.com',
    passwordHash: bcrypt.hashSync('User@1234', 10),
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// Helper to generate JWT Token
function generateToken(user: StoredUser) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded as any;
    next();
  });
}

// Role-based Authorization: Require Admin
function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden: Administrator privileges required to access this resource.'
    });
  }
  next();
}

// ----------------- AUTHENTICATION API ROUTES -----------------

// POST /api/auth/register (Standard User Registration)
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = usersDb.find(u => u.email === normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Securely hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'user', // Public registration is strictly role: 'user'
      createdAt: new Date().toISOString()
    };

    usersDb.push(newUser);

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login (User Portal Login)
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.find(u => u.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error during user login.' });
  }
});

// POST /api/auth/admin/login (Dedicated Admin Portal Login)
app.post('/api/auth/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Admin email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.find(u => u.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    // Role verification: strictly require role: 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access Denied: You do not possess administrator rights to enter this portal.'
      });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Admin authorization granted.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error during admin login.' });
  }
});

// GET /api/auth/me (Verify active session and role)
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    user: req.user
  });
});

// Protected Admin API Endpoints
app.get('/api/admin/audit-log', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Authorized admin access',
    activeUsersCount: usersDb.length,
    users: usersDb.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
  });
});

// ----------------- EPISODE & STORAGE API ROUTES -----------------

// POST /api/upload/video (Upload authorized video file to storage)
app.post(
  '/api/upload/video',
  authenticateToken,
  requireAdmin,
  uploadVideo.single('video'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided.' });
      }

      const videoUrl = `/uploads/videos/${req.file.filename}`;
      const fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';

      return res.status(201).json({
        message: 'Video file uploaded successfully to authorized storage.',
        videoUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: fileSizeMb,
        mimeType: req.file.mimetype,
        storageType: 'Local High-Speed CDN Storage'
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to upload video file.' });
    }
  }
);

// POST /api/upload/thumbnail (Upload episode thumbnail)
app.post(
  '/api/upload/thumbnail',
  authenticateToken,
  requireAdmin,
  uploadThumb.single('thumbnail'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No thumbnail file provided.' });
      }

      const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;

      return res.status(201).json({
        message: 'Thumbnail uploaded successfully.',
        thumbnailUrl,
        filename: req.file.filename
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to upload thumbnail.' });
    }
  }
);

// Episodes In-Memory / Simulated MongoDB Collection
interface StoredEpisode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  duration: string;
  airDate: string;
  thumbnail: string;
  synopsis: string;
  videoUrl: string;
  views?: string;
  status: 'Published' | 'Draft';
  fileSize?: string;
  videoStorageType?: string;
  createdAt: string;
  updatedAt: string;
}

const episodesDb: StoredEpisode[] = [
  {
    id: 'ds-1',
    animeId: 'demon-slayer',
    number: 1,
    title: 'Cruelty',
    duration: '24:10',
    airDate: 'Apr 6, 2019',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    synopsis: "Tanjiro's peaceful life changes forever when his family is attacked by demons in the snowy mountains.",
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    views: '4.8M',
    status: 'Published',
    fileSize: '42.5 MB',
    videoStorageType: 'Authorized CDN Storage',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ds-2',
    animeId: 'demon-slayer',
    number: 2,
    title: 'Trainer Sakonji Urokodaki',
    duration: '24:08',
    airDate: 'Apr 13, 2019',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80',
    synopsis: 'Guided by Giyu Tomioka, Tanjiro and Nezuko head toward Mt. Sagiri to seek training under Urokodaki.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    views: '3.6M',
    status: 'Published',
    fileSize: '39.8 MB',
    videoStorageType: 'Authorized CDN Storage',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/episodes (List episodes with optional ?animeId= and ?status= filters)
app.get('/api/episodes', (req: Request, res: Response) => {
  const { animeId, status } = req.query;
  let results = [...episodesDb];

  if (animeId) {
    results = results.filter(e => e.animeId === animeId);
  }
  if (status) {
    results = results.filter(e => e.status === status);
  }

  results.sort((a, b) => a.number - b.number);
  res.json({ episodes: results });
});

// POST /api/episodes (Create new episode with authorized video storage URL)
app.post('/api/episodes', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      animeId,
      number,
      title,
      duration,
      airDate,
      thumbnail,
      synopsis,
      videoUrl,
      status,
      fileSize,
      videoStorageType
    } = req.body;

    if (!animeId || !title) {
      return res.status(400).json({ error: 'animeId and title are required.' });
    }

    const episodeNumber = Number(number) || 1;
    const newEpisode: StoredEpisode = {
      id: `ep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      animeId,
      number: episodeNumber,
      title: title.trim(),
      duration: duration || '24:00',
      airDate: airDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
      synopsis: synopsis || 'An exciting new episode of the series.',
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      views: '0',
      status: status === 'Draft' ? 'Draft' : 'Published',
      fileSize: fileSize || '35.0 MB',
      videoStorageType: videoStorageType || 'Authorized Cloud Video Storage',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    episodesDb.push(newEpisode);

    // Calculate total published episodes for this anime
    const publishedCount = episodesDb.filter(e => e.animeId === animeId && e.status === 'Published').length;

    return res.status(201).json({
      message: 'Episode created and stored successfully.',
      episode: newEpisode,
      animePublishedCount: publishedCount
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create episode.' });
  }
});

// PUT /api/episodes/:id (Update existing episode)
app.put('/api/episodes/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = episodesDb.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Episode not found.' });
    }

    const existing = episodesDb[index];
    const updated: StoredEpisode = {
      ...existing,
      ...req.body,
      number: req.body.number !== undefined ? Number(req.body.number) : existing.number,
      updatedAt: new Date().toISOString()
    };

    episodesDb[index] = updated;

    const publishedCount = episodesDb.filter(
      e => e.animeId === updated.animeId && e.status === 'Published'
    ).length;

    return res.json({
      message: 'Episode updated successfully.',
      episode: updated,
      animePublishedCount: publishedCount
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update episode.' });
  }
});

// DELETE /api/episodes/:id (Delete episode)
app.delete('/api/episodes/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = episodesDb.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Episode not found.' });
    }

    const deleted = episodesDb.splice(index, 1)[0];
    const publishedCount = episodesDb.filter(
      e => e.animeId === deleted.animeId && e.status === 'Published'
    ).length;

    return res.json({
      message: 'Episode deleted successfully.',
      deletedEpisodeId: id,
      animeId: deleted.animeId,
      animePublishedCount: publishedCount
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete episode.' });
  }
});

// ----------------- VITE INTEGRATION -----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AniVerse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
