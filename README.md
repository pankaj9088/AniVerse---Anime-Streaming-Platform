# 🎬 AniVerse — Modern Anime Streaming Platform

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite&logoColor=white)

**A modern, responsive anime streaming platform and CMS built with React 19, TypeScript, Express, and Tailwind CSS.**

[Getting Started](#-getting-started) • [Features](#-key-features) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [License](#-license)

</div>

---

## 🌟 Overview

**AniVerse** is a full-featured anime streaming web application designed with a clean, light-themed aesthetic. It features an interactive video player, comprehensive anime catalog, personal user profiles with watchlists and history, and a dedicated Administrator portal for managing series, uploading episodes, and reviewing analytics.

---

## ✨ Key Features

### 📺 Streaming & Catalog Experience
- **Interactive Video Player:** Seamless playback with episode selector, next episode auto-progression, playback progress memory, and stream source switching.
- **Dynamic Catalog Discovery:** Browse trending titles, latest releases, movies, and TV series.
- **Advanced Filtering & Search:** Filter by multi-genre tags, release year range, series status (Ongoing/Completed), and sort by popularity, rating, or newest additions.
- **Detailed Anime Pages:** Comprehensive views with synopsis, studio credits, genres, rating badges, episode lists, and user community reviews.

### 👤 User Account & Profile
- **Authentication:** Secure user registration and login with bcrypt password hashing and JSON Web Tokens (JWT).
- **Personal Watchlist ("My List"):** Bookmark favorite anime series with one-click toggling.
- **Watch History & Analytics:** Real-time tracking of watch progress, completed episodes, and total hours watched.
- **Toast Notifications:** Instant feedback for user actions like bookmarks, authentication, and profile updates.

### 🛡️ Administrative Portal (`/admin`)
- **Role-Based Access Control:** Strict route guarding ensuring only authenticated administrators can access management tools.
- **Anime Catalog Management:** Modals to create, update, or remove anime entries, update banners, posters, and metadata.
- **Episode CMS & Media Uploads:**
  - Video file uploads (up to 500MB) via Multer disk storage.
  - Custom thumbnail uploads (up to 25MB).
  - Draft vs. Published status management with automatic episode count synchronization.
- **Analytics Dashboard:** Overview of total views, active user counts, and platform catalog metrics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion (Framer Motion) |
| **Backend** | Express 4.x, Node.js, `tsx` (TypeScript Execution) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **File Storage** | Multer (local disk storage for videos and thumbnails) |
| **Build & Dev** | Vite 8 (with middleware integration into Express) |

---

## 📁 Project Structure

```text
aniverse---anime-streaming-platform/
├── dist/                      # Production build output
├── public/                    # Static assets
├── uploads/                   # Uploaded media assets
│   ├── thumbnails/            # Uploaded episode thumbnails
│   └── videos/                # Uploaded anime video files
├── src/
│   ├── assets/                # Local graphic assets and banners
│   ├── components/            # Reusable UI components
│   │   ├── views/             # Page views (Home, Watch, Details, Admin, etc.)
│   │   ├── AddEditAnimeModal.tsx
│   │   ├── AddEditEpisodeModal.tsx
│   │   ├── AnimeCard.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroBanner.tsx
│   │   └── Navbar.tsx
│   ├── context/
│   │   └── AppContext.tsx     # Global application state & auth provider
│   ├── data/
│   │   └── animeData.ts       # Curated initial catalog database
│   ├── App.tsx                # Main view router & layout
│   ├── index.css              # Global styles & Tailwind CSS imports
│   ├── main.tsx               # React application entrypoint
│   └── types.ts               # Shared TypeScript data models & interfaces
├── index.html                 # HTML template
├── LICENSE                    # MIT License
├── package.json               # Dependencies and scripts
├── server.ts                  # Express backend & Vite middleware server
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended, tested on Node.js v22.x)
- `npm` (v9.x or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aniverse-anime-streaming-platform.git
   cd aniverse---anime-streaming-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (Optional):**
   Copy `.env.example` to `.env` or `.env.local` to customize server port or admin credentials:
   ```env
   PORT=3000
   JWT_SECRET=your_custom_jwt_secret_key
   ADMIN_EMAIL=your_admin_email@example.com
   ADMIN_PASSWORD=your_secure_admin_password
   ```

---

## 💻 Running the Application

### Development Mode
Starts the combined Express backend and Vite client server:
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:3000
```

### Production Build
To build the optimized client bundle and run the server:
```bash
npm run build
npm start
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use, modify, and distribute this software.
