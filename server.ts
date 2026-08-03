import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { INITIAL_GAMES } from './src/data/initialGames.js';
import type { GameProject } from './src/types.js';

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Directories (uses /tmp on Vercel / serverless environments to avoid read-only filesystem errors)
const isServerless = Boolean(process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const UPLOADS_DIR = isServerless ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'uploads');
const BUILDS_DIR = path.join(UPLOADS_DIR, 'builds');

// Safely ensure directories exist
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(BUILDS_DIR)) {
    fs.mkdirSync(BUILDS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Directory creation skipped or running in restricted environment:', e);
}

// Helper: Read games from file storage or initialize with defaults
function getStoredGames(): GameProject[] {
  try {
    if (fs.existsSync(GAMES_FILE)) {
      const data = fs.readFileSync(GAMES_FILE, 'utf-8');
      const games = JSON.parse(data);
      if (Array.isArray(games)) {
        return games;
      }
    }
  } catch (err) {
    console.error('Error reading games.json, falling back to initial data:', err);
  }

  // Save initial games to storage
  saveStoredGames(INITIAL_GAMES);
  return INITIAL_GAMES;
}

// Helper: Save games to file storage
function saveStoredGames(games: GameProject[]) {
  try {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving games.json:', err);
  }
}


// Multer Storage Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'buildFile') {
      cb(null, BUILDS_DIR);
    } else {
      cb(null, UPLOADS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB max limit per file
});

// Admin config storage
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

function getAdminConfig() {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const data = fs.readFileSync(ADMIN_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading admin.json:', err);
  }
  const defaultConfig = { password: 'mozzie2026', token: 'mozzie-admin-secret-token-2026' };
  saveAdminConfig(defaultConfig);
  return defaultConfig;
}

function saveAdminConfig(config: { password: string; token: string }) {
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin.json:', err);
  }
}

// Middleware to verify Admin Header for restricted routes
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const adminKey = req.headers['x-admin-key'] || req.headers.authorization?.replace('Bearer ', '');
  const config = getAdminConfig();

  if (adminKey && (adminKey === config.token || adminKey === config.password)) {
    return next();
  }

  return res.status(401).json({ 
    error: 'Admin authentication required. Only Kerem (Admin) can upload or modify game projects.' 
  });
}

// Serve uploads directory publicly for browser preview and direct downloads
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    // If it's a build file, set attachment download header
    if (filePath.includes('/builds/') || filePath.endsWith('.zip') || filePath.endsWith('.apk') || filePath.endsWith('.exe') || filePath.endsWith('.AppImage')) {
      const fileName = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    }
  }
}));

// API Routes

// Admin Authentication Endpoints
app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  const config = getAdminConfig();

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === config.password || password === config.token) {
    return res.json({ success: true, token: config.token });
  }

  return res.status(401).json({ error: 'Incorrect admin password.' });
});

app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters long.' });
  }

  const config = getAdminConfig();
  config.password = newPassword.trim();
  saveAdminConfig(config);

  return res.json({ success: true, message: 'Admin password updated successfully!' });
});

// 1. Get all game projects
app.get('/api/games', (req, res) => {
  const games = getStoredGames();
  res.json(games);
});

// 2. Get single game project by ID
app.get('/api/games/:id', (req, res) => {
  const games = getStoredGames();
  const game = games.find((g) => g.id === req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game project not found' });
  }
  res.json(game);
});

// 3. Create a new game project (Admin Only)
app.post('/api/games', requireAdminAuth, (req, res) => {
  const games = getStoredGames();
  const newGame: GameProject = req.body;

  if (!newGame.id || !newGame.title) {
    return res.status(400).json({ error: 'Title and ID are required' });
  }

  // Check duplicate ID
  if (games.some((g) => g.id === newGame.id)) {
    newGame.id = newGame.id + '-' + Date.now();
  }

  // Set default counters
  newGame.downloadsCount = newGame.downloadsCount || 0;
  newGame.likesCount = newGame.likesCount || 0;
  newGame.reviews = newGame.reviews || [];
  newGame.devlogs = newGame.devlogs || [];
  newGame.builds = newGame.builds || [];
  newGame.screenshots = newGame.screenshots || [];
  newGame.technicalHighlights = newGame.technicalHighlights || [];

  games.unshift(newGame);
  saveStoredGames(games);

  res.status(201).json({ message: 'Game project created successfully', game: newGame });
});

// 4. Update an existing game project (Admin Only)
app.put('/api/games/:id', requireAdminAuth, (req, res) => {
  const games = getStoredGames();
  const index = games.findIndex((g) => g.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Game project not found' });
  }

  const updatedGame: GameProject = {
    ...games[index],
    ...req.body
  };

  games[index] = updatedGame;
  saveStoredGames(games);

  res.json({ message: 'Game project updated successfully', game: updatedGame });
});

// 5. Delete a game project (Admin Only)
app.delete('/api/games/:id', requireAdminAuth, (req, res) => {
  let games = getStoredGames();
  const exists = games.some((g) => g.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ error: 'Game project not found' });
  }

  games = games.filter((g) => g.id !== req.params.id);
  saveStoredGames(games);

  res.json({ message: 'Game project deleted successfully' });
});

// 6. Record build download & increment count
app.post('/api/games/:id/download/:buildId', (req, res) => {
  const games = getStoredGames();
  const game = games.find((g) => g.id === req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game project not found' });
  }

  game.downloadsCount = (game.downloadsCount || 0) + 1;

  if (game.builds) {
    const build = game.builds.find((b) => b.id === req.params.buildId);
    if (build) {
      build.downloadCount = (build.downloadCount || 0) + 1;
    }
  }

  saveStoredGames(games);
  res.json({ success: true, downloadsCount: game.downloadsCount });
});

// 7. Like a game
app.post('/api/games/:id/like', (req, res) => {
  const games = getStoredGames();
  const game = games.find((g) => g.id === req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game project not found' });
  }

  game.likesCount = (game.likesCount || 0) + 1;
  saveStoredGames(games);

  res.json({ success: true, likesCount: game.likesCount });
});

// 8. Add review
app.post('/api/games/:id/reviews', (req, res) => {
  const games = getStoredGames();
  const game = games.find((g) => g.id === req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game project not found' });
  }

  const { author, rating, comment } = req.body;
  if (!author || !rating || !comment) {
    return res.status(400).json({ error: 'Author, rating, and comment are required' });
  }

  const newReview = {
    id: 'rev-' + Date.now(),
    author: String(author).trim(),
    rating: Number(rating) || 5,
    date: new Date().toISOString().split('T')[0],
    comment: String(comment).trim()
  };

  game.reviews = game.reviews || [];
  game.reviews.unshift(newReview);
  saveStoredGames(games);

  res.json({ success: true, review: newReview, reviews: game.reviews });
});

// 9. Upload File Endpoint (Builds, Cover Images, Screenshots, Videos) - Admin Only
app.post('/api/upload', requireAdminAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const isBuild = req.body.isBuild === 'true' || req.file.fieldname === 'buildFile';
  const subFolder = isBuild ? 'builds' : '';
  const fileUrl = `/uploads/${subFolder ? subFolder + '/' : ''}${req.file.filename}`;

  const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';

  res.json({
    success: true,
    fileUrl,
    fileName: req.file.originalname,
    storedName: req.file.filename,
    fileSize: fileSizeMB,
    mimeType: req.file.mimetype
  });
});

// Export Express app for serverless function deployments (e.g. Vercel)
export default app;

// Vite Middleware for Development and Static Express Serving in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unity Developer Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL && !process.env.NOW_REGION) {
  startServer();
}
