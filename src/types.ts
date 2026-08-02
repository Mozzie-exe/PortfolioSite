export type PlatformType = 'windows' | 'mac' | 'linux' | 'webgl' | 'android' | 'ios';

export type GameStatus = 'Released' | 'Playable Demo' | 'Early Access' | 'In Development' | 'Prototype';

export interface GameBuild {
  id: string;
  platform: PlatformType;
  title: string; // e.g. "Windows x64 Build v1.2"
  fileName: string;
  fileUrl: string; // URL for download
  fileSize: string; // e.g. "54.2 MB"
  version: string; // e.g. "1.2.0"
  releaseDate: string;
  isExternalLink?: boolean;
  downloadCount: number;
}

export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  directX?: string;
  storage: string;
}

export interface DevlogItem {
  id: string;
  date: string;
  version: string;
  title: string;
  content: string;
  changes?: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
}

export interface GameProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  detailedOverview: string;
  coverImage: string;
  unityVersion: string; // e.g., "Unity 6 (6000.0)", "2022.3 LTS"
  renderPipeline: 'URP' | 'HDRP' | 'Built-in' | 'Custom';
  genre: string[];
  status: GameStatus;
  releaseDate: string;
  developerNotes?: string;
  featured: boolean;
  
  // Media
  trailerUrl?: string; // YouTube embed URL or uploaded MP4/WebM URL
  screenshots: string[]; // Array of image URLs
  
  // Build Downloads
  builds: GameBuild[];
  
  // Tech Specs
  technicalHighlights: string[];
  minRequirements?: SystemRequirements;
  recRequirements?: SystemRequirements;
  
  // Devlog & Updates
  devlogs: DevlogItem[];
  
  // Engagement
  reviews: ReviewItem[];
  downloadsCount: number;
  likesCount: number;
}

export interface FilterState {
  searchQuery: string;
  selectedGenre: string;
  selectedPlatform: string;
  selectedUnityVersion: string;
  selectedStatus: string;
  sortBy: 'featured' | 'newest' | 'downloads' | 'rating';
}
