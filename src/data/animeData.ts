import { Anime, UserProfile } from '../types';

import heroBannerImg from '../assets/images/hero_anime_banner_1790494301144.jpg';
import demonSlayerPoster from '../assets/images/poster_demon_slayer_1790494323302.jpg';
import jujutsuPoster from '../assets/images/poster_jujutsu_sorcerer_1790494340684.jpg';
import soloLevelingPoster from '../assets/images/poster_shadow_hunter_1790494354410.jpg';
import userAvatarImg from '../assets/images/avatar_anime_user_1790494366733.jpg';

export { userAvatarImg, heroBannerImg };

export const ALL_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Horror',
  'Mystery',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Isekai',
  'Shounen',
  'School'
];

export const INITIAL_ANIME_LIST: Anime[] = [
  {
    id: 'naruto-shippuden',
    title: 'Naruto Shippuden',
    japaneseTitle: 'NARUTO -ナルト- 疾風伝',
    synopsis: 'Naruto Uzumaki, a hyperactive and knuckle-headed ninja, returns to the Hidden Leaf Village after two and a half years of rigorous training with Jiraiya. Along with Sakura, Kakashi, and his fellow shinobi, he sets out to rescue Gaara and confront the dangerous Akatsuki syndicate.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    banner: heroBannerImg,
    rating: 8.9,
    year: 2007,
    episodesCount: 500,
    status: 'Completed',
    genres: ['Action', 'Adventure', 'Fantasy', 'Shounen'],
    studio: 'Studio Pierrot',
    type: 'TV',
    trendingRank: 1,
    popularityRank: 2,
    featured: true,
    episodes: [
      {
        id: 'naruto-1',
        number: 1,
        title: 'Homecoming',
        duration: '23:15',
        airDate: 'Feb 15, 2007',
        thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Naruto Uzumaki returns to Konohagakure after two and a half years of training with Jiraiya. He reunites with Sakura and discovers how much his friends have changed.',
        views: '3.4M'
      },
      {
        id: 'naruto-2',
        number: 2,
        title: 'The Akatsuki Makes Its Move',
        duration: '23:18',
        airDate: 'Feb 15, 2007',
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Kakashi tests Naruto and Sakura to evaluate their growth. Meanwhile, Deidara and Sasori approach the Hidden Sand Village.',
        views: '2.9M'
      },
      {
        id: 'naruto-3',
        number: 3,
        title: 'The Results of Training',
        duration: '23:20',
        airDate: 'Feb 22, 2007',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        synopsis: 'The bell test against Kakashi reaches its climax as Naruto and Sakura use a witty strategy to seize the bells.',
        views: '2.5M'
      },
      {
        id: 'naruto-4',
        number: 4,
        title: 'The Jinchuriki of the Sand',
        duration: '23:15',
        airDate: 'Mar 1, 2007',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Gaara confronts Deidara in an aerial sand duel high above Sunagakure to defend his people.',
        views: '3.1M'
      }
    ]
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    japaneseTitle: '鬼滅の刃 (Kimetsu no Yaiba)',
    synopsis: 'Tanjiro Kamado sets out on a dangerous journey to find a cure for his sister Nezuko, who has been turned into a demon. Along the way, he faces powerful demonic enemies and meets new allies in the Demon Slayer Corps.',
    poster: demonSlayerPoster,
    banner: demonSlayerPoster,
    rating: 8.7,
    year: 2019,
    episodesCount: 44,
    status: 'Ongoing',
    genres: ['Action', 'Fantasy', 'Supernatural', 'Drama'],
    studio: 'ufotable',
    type: 'TV',
    trendingRank: 2,
    popularityRank: 3,
    featured: true,
    episodes: [
      {
        id: 'ds-1',
        number: 1,
        title: 'Cruelty',
        duration: '24:10',
        airDate: 'Apr 6, 2019',
        thumbnail: demonSlayerPoster,
        synopsis: "Tanjiro's peaceful life changes forever when his family is attacked by demons in the snowy mountains, and Nezuko begins transforming.",
        views: '4.8M'
      },
      {
        id: 'ds-2',
        number: 2,
        title: 'Trainer Sakonji Urokodaki',
        duration: '24:08',
        airDate: 'Apr 13, 2019',
        thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Guided by Giyu Tomioka, Tanjiro and Nezuko head toward Mt. Sagiri to seek training under the retired Water Hashira Urokodaki.',
        views: '3.6M'
      },
      {
        id: 'ds-3',
        number: 3,
        title: 'Sabito and Makomo',
        duration: '24:12',
        airDate: 'Apr 20, 2019',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Tanjiro faces the daunting boulder trial and is pushed to his limits by the spirits of Sabito and Makomo.',
        views: '3.2M'
      },
      {
        id: 'ds-4',
        number: 4,
        title: 'Final Selection',
        duration: '24:10',
        airDate: 'Apr 27, 2019',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        synopsis: 'The Final Selection on Mt. Fujikasane begins amidst blossoming wisteria, where candidates must survive 7 nights surrounded by demons.',
        views: '3.9M'
      },
      {
        id: 'ds-5',
        number: 5,
        title: 'My Own Steel',
        duration: '24:15',
        airDate: 'May 4, 2019',
        thumbnail: demonSlayerPoster,
        synopsis: 'Tanjiro survives the ordeal, chooses his ore for his Nichirin sword, and returns to find Nezuko finally awake.',
        views: '2.8M'
      }
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Kenji Takahashi',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '2 days ago',
        comment: 'The animation quality by ufotable is simply unmatched. The Hinokami Kagura sequence still gives me chills every time!',
        likes: 142
      },
      {
        id: 'r2',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '1 week ago',
        comment: 'Emotional, stunning soundtrack, and Tanjiro is such a genuinely kind protagonist. Highly recommended!',
        likes: 88
      }
    ]
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    japaneseTitle: '呪術廻戦',
    synopsis: 'Yuji Itadori, a kind-hearted teenager, joins his school’s Occult Club for fun, only to discover that its members are actual sorcerers who can manipulate cursed energy. To save his friends, Yuji swallows a finger belonging to Sukuna, the King of Curses.',
    poster: jujutsuPoster,
    banner: jujutsuPoster,
    rating: 8.8,
    year: 2020,
    episodesCount: 24,
    status: 'Ongoing',
    genres: ['Action', 'Supernatural', 'Fantasy', 'School'],
    studio: 'MAPPA',
    type: 'TV',
    trendingRank: 3,
    popularityRank: 1,
    featured: true,
    episodes: [
      {
        id: 'jjk-1',
        number: 1,
        title: 'Ryomen Sukuna',
        duration: '23:55',
        airDate: 'Oct 3, 2020',
        thumbnail: jujutsuPoster,
        synopsis: 'High schooler Yuji Itadori swallows a cursed talisman to protect Megumi Fushiguro and becomes host to Sukuna.',
        views: '4.2M'
      },
      {
        id: 'jjk-2',
        number: 2,
        title: 'For Myself',
        duration: '23:50',
        airDate: 'Oct 10, 2020',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Satoru Gojo brings Yuji to Tokyo Jujutsu High, where Yuji faces Principal Yaga to prove his resolve.',
        views: '3.7M'
      },
      {
        id: 'jjk-3',
        number: 3,
        title: 'Girl of Steel',
        duration: '23:52',
        airDate: 'Oct 17, 2020',
        thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Nobara Kugisaki arrives in Tokyo, and Gojo sends the freshman trio to exorcise an abandoned apartment complex.',
        views: '3.4M'
      }
    ]
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    japaneseTitle: 'ONE PIECE',
    synopsis: 'Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates. With a course charted for the treacherous waters of the Grand Line, this is one captain who’ll never give up until he claims the greatest treasure on Earth.',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    rating: 8.9,
    year: 1999,
    episodesCount: 1123,
    status: 'Ongoing',
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    studio: 'Toei Animation',
    type: 'TV',
    trendingRank: 4,
    popularityRank: 4,
    featured: true,
    episodes: [
      {
        id: 'op-1123',
        number: 1123,
        title: 'The Drums of Liberation: Clash in Egghead',
        duration: '23:45',
        airDate: 'Sep 24, 2026',
        thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Luffy and the Straw Hats unleash their full strength against the World Government fleet encircling the Future Island Egghead.',
        views: '5.1M'
      },
      {
        id: 'op-1122',
        number: 1122,
        title: 'The Last Lesson! Impact Inherited',
        duration: '23:50',
        airDate: 'Sep 17, 2026',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Garp battles the Blackbeard Pirates on Hachinosu to allow Koby and the young Marine officers to escape.',
        views: '4.6M'
      }
    ]
  },
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    japaneseTitle: '俺だけレベルアップな件 (Ore dake Level Up na Ken)',
    synopsis: 'In a world where hunters, humans with supernatural powers, battle deadly monsters to protect humanity, Sung Jinwoo is notoriously known as the "Weakest Hunter of All Mankind". After surviving a brutal double dungeon, a mysterious quest window appears only to him.',
    poster: soloLevelingPoster,
    banner: soloLevelingPoster,
    rating: 8.6,
    year: 2024,
    episodesCount: 12,
    status: 'Ongoing',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    studio: 'A-1 Pictures',
    type: 'TV',
    trendingRank: 5,
    popularityRank: 5,
    featured: true,
    episodes: [
      {
        id: 'sl-1',
        number: 1,
        title: 'I’m Used to It',
        duration: '23:40',
        airDate: 'Jan 7, 2024',
        thumbnail: soloLevelingPoster,
        synopsis: 'E-Rank hunter Sung Jinwoo leads a raid party into a low-level dungeon that hides a terrifying secret chamber.',
        views: '6.2M'
      },
      {
        id: 'sl-2',
        number: 2,
        title: 'If I Had One More Chance',
        duration: '23:45',
        airDate: 'Jan 14, 2024',
        thumbnail: soloLevelingPoster,
        synopsis: 'Trapped inside the Cartenon Temple, the raid party must decipher three commandments before the stone statues eliminate them all.',
        views: '5.5M'
      }
    ]
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    japaneseTitle: '進撃の巨人 (Shingeki no Kyojin)',
    synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide behind enormous concentric walls. Eren Yeager vows to cleanse the earth of every giant titan after witnessing his mother’s demise.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    rating: 8.8,
    year: 2013,
    episodesCount: 87,
    status: 'Completed',
    genres: ['Action', 'Drama', 'Mystery', 'Fantasy'],
    studio: 'Wit Studio / MAPPA',
    type: 'TV',
    trendingRank: 6,
    popularityRank: 6,
    episodes: [
      {
        id: 'aot-1',
        number: 1,
        title: 'To You, in 2000 Years: The Fall of Shiganshina',
        duration: '24:00',
        airDate: 'Apr 7, 2013',
        thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
        synopsis: 'After a century of fragile peace, the Colossal Titan appears in a flash of lightning and breaches Wall Maria.',
        views: '5.9M'
      }
    ]
  },
  {
    id: 'bleach',
    title: 'Bleach: Thousand-Year Blood War',
    japaneseTitle: 'BLEACH 千年血戦篇',
    synopsis: 'When a new enemy appears, Substitute Soul Reaper Ichigo Kurosaki jumps back into the battlefield with his Zanpakuto to help those in need. The ancient Quincy empire known as the Wandenreich declares total war against the Soul Society.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    rating: 8.4,
    year: 2022,
    episodesCount: 26,
    status: 'Ongoing',
    genres: ['Action', 'Supernatural', 'Fantasy'],
    studio: 'Studio Pierrot',
    type: 'TV',
    trendingRank: 7,
    popularityRank: 8,
    episodes: [
      {
        id: 'bleach-1',
        number: 1,
        title: 'The Blood Warfare',
        duration: '24:15',
        airDate: 'Oct 11, 2022',
        thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Hollows mysteriously disappear in the World of the Living, and shadows infiltrate the Soul King’s palace grounds.',
        views: '2.7M'
      }
    ]
  },
  {
    id: 'my-hero-academia',
    title: 'My Hero Academia',
    japaneseTitle: '僕のヒーローアカデミア',
    synopsis: 'In a world where 80% of humanity possesses superpowers known as Quirks, Izuku Midoriya is born completely quirkless. Yet, a fateful encounter with the greatest hero All Might changes his destiny forever as he enters U.A. High School.',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
    rating: 8.3,
    year: 2016,
    episodesCount: 138,
    status: 'Ongoing',
    genres: ['Action', 'School', 'Supernatural', 'Shounen'],
    studio: 'Bones',
    type: 'TV',
    trendingRank: 8,
    popularityRank: 7,
    episodes: [
      {
        id: 'mha-1',
        number: 1,
        title: 'Izuku Midoriya: Origin',
        duration: '24:05',
        airDate: 'Apr 3, 2016',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Deku dreams of saving people with a smile despite being diagnosed as quirkless in a society obsessed with superpowers.',
        views: '3.8M'
      }
    ]
  },
  {
    id: 'tokyo-revengers',
    title: 'Tokyo Revengers',
    japaneseTitle: '東京卍リベンジャーズ',
    synopsis: 'Takemichi Hanagaki’s life is at an all-time low. Just when he thought it couldn’t get worse, he finds out that Hinata Tachibana, his ex-girlfriend, was murdered by the Tokyo Manji Gang. Then, he is thrust back in time 12 years to his middle school days.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    rating: 8.4,
    year: 2021,
    episodesCount: 50,
    status: 'Completed',
    genres: ['Action', 'Drama', 'Supernatural'],
    studio: 'LIDENFILMS',
    type: 'TV',
    trendingRank: 9,
    popularityRank: 9,
    episodes: [
      {
        id: 'tr-1',
        number: 1,
        title: 'Reborn',
        duration: '23:50',
        airDate: 'Apr 11, 2021',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Pushed onto train tracks, 26-year-old Takemichi wakes up twelve years earlier, when he was running with a middle-school delinquent gang.',
        views: '3.1M'
      }
    ]
  },
  {
    id: 'hunter-x-hunter',
    title: 'Hunter x Hunter',
    japaneseTitle: 'HUNTER×HUNTER',
    synopsis: 'Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. With his friends Killua, Kurapika, and Leorio, he embarks on a perilous journey to take the rigorous Hunter Exam and discover why his father chose to leave him.',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    rating: 8.9,
    year: 2011,
    episodesCount: 148,
    status: 'Completed',
    genres: ['Action', 'Adventure', 'Fantasy', 'Shounen'],
    studio: 'Madhouse',
    type: 'TV',
    trendingRank: 10,
    popularityRank: 10,
    episodes: [
      {
        id: 'hxh-1',
        number: 1,
        title: 'Departure x And x Friends',
        duration: '23:40',
        airDate: 'Oct 2, 2011',
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Gon catches the Master of the Swamp to win Mito-san’s permission to participate in the legendary Hunter Examination.',
        views: '4.5M'
      }
    ]
  },
  {
    id: 'frieren-journey',
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: '葬送のフリーレン (Sousou no Frieren)',
    synopsis: 'Elven mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. As an elf with a lifespan of over a thousand years, she promises to see her friends again before embarking on a journey to understand human emotions.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    rating: 9.1,
    year: 2023,
    episodesCount: 28,
    status: 'Completed',
    genres: ['Adventure', 'Drama', 'Fantasy', 'Slice of Life'],
    studio: 'Madhouse',
    type: 'TV',
    trendingRank: 11,
    popularityRank: 11,
    episodes: [
      {
        id: 'frieren-1',
        number: 1,
        title: 'The Journey’s End',
        duration: '24:30',
        airDate: 'Sep 29, 2023',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
        synopsis: 'The Hero Party returns victorious after their 10-year campaign. Decades pass in an instant for the long-lived elf Frieren.',
        views: '4.1M'
      }
    ]
  },
  {
    id: 'spy-family',
    title: 'SPY x FAMILY',
    japaneseTitle: 'SPY×FAMILY',
    synopsis: 'Master spy Twilight must disguise himself as psychiatrist Loid Forger, adopt an orphan child, and marry an unremarkable civil servant to infiltrate an elite political circle. Unknown to him, his daughter Anya is a telepath, and his wife Yor is a legendary assassin.',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
    rating: 8.5,
    year: 2022,
    episodesCount: 37,
    status: 'Ongoing',
    genres: ['Action', 'Comedy', 'Slice of Life'],
    studio: 'Wit Studio / CloverWorks',
    type: 'TV',
    trendingRank: 12,
    popularityRank: 12,
    episodes: [
      {
        id: 'sxf-1',
        number: 1,
        title: 'Operation Strix',
        duration: '24:10',
        airDate: 'Apr 9, 2022',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
        synopsis: 'Code name Twilight is assigned Operation Strix: build a fake family in seven days to enroll a child in prestigious Eden Academy.',
        views: '3.9M'
      }
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Pankaj Kumar Sah',
  email: 'sahpankajkumar690@gmail.com',
  avatar: userAvatarImg,
  myList: ['one-piece', 'demon-slayer', 'jujutsu-kaisen', 'attack-on-titan', 'solo-leveling', 'my-hero-academia'],
  watchHistory: [
    {
      animeId: 'demon-slayer',
      episodeNumber: 1,
      episodeTitle: 'Cruelty',
      progressPercent: 92,
      watchedAt: 'Today, 2:30 PM'
    },
    {
      animeId: 'one-piece',
      episodeNumber: 1123,
      episodeTitle: 'The Drums of Liberation',
      progressPercent: 100,
      watchedAt: 'Yesterday'
    },
    {
      animeId: 'solo-leveling',
      episodeNumber: 2,
      episodeTitle: 'If I Had One More Chance',
      progressPercent: 45,
      watchedAt: '3 days ago'
    }
  ],
  stats: {
    myListCount: 12,
    episodesWatched: 48,
    hoursWatched: 320
  }
};

export const ADMIN_STATS = {
  totalAnime: 128,
  totalEpisodes: 1240,
  totalUsers: 15420,
  totalViews: 85200,
  viewsGrowth: '+12.4%',
  usersGrowth: '+412 this week'
};
