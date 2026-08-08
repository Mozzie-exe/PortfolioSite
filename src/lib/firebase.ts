import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { GameProject, ReviewItem } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const GAMES_COLLECTION = 'games';

// Helper to sanitize undefined values before saving to Firestore
function sanitizeGame(game: GameProject): Record<string, any> {
  return JSON.parse(JSON.stringify(game));
}

/**
 * Realtime listener for game projects in Firestore
 */
export function subscribeGames(onUpdate: (games: GameProject[]) => void, onError?: (err: any) => void) {
  const gamesRef = collection(db, GAMES_COLLECTION);
  return onSnapshot(
    gamesRef,
    (snapshot) => {
      const list: GameProject[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as GameProject);
      });
      // Sort by creation date or release date descending
      list.sort((a, b) => new Date(b.releaseDate || '2000').getTime() - new Date(a.releaseDate || '2000').getTime());
      onUpdate(list);
    },
    (err) => {
      console.error('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch games once
 */
export async function getGamesFromFirestore(): Promise<GameProject[]> {
  const gamesRef = collection(db, GAMES_COLLECTION);
  const snapshot = await getDocs(gamesRef);
  const list: GameProject[] = [];
  snapshot.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() } as GameProject);
  });
  list.sort((a, b) => new Date(b.releaseDate || '2000').getTime() - new Date(a.releaseDate || '2000').getTime());
  return list;
}

/**
 * Save game project to Firestore (Create or Update)
 */
export async function saveGameToFirestore(game: GameProject): Promise<void> {
  const docRef = doc(db, GAMES_COLLECTION, game.id);
  const cleanData = sanitizeGame(game);
  await setDoc(docRef, cleanData, { merge: true });
}

/**
 * Delete game project from Firestore
 */
export async function deleteGameFromFirestore(gameId: string): Promise<void> {
  const docRef = doc(db, GAMES_COLLECTION, gameId);
  await deleteDoc(docRef);
}

/**
 * Add review to game in Firestore
 */
export async function addReviewToFirestore(gameId: string, review: ReviewItem): Promise<void> {
  const docRef = doc(db, GAMES_COLLECTION, gameId);
  const cleanReview = JSON.parse(JSON.stringify(review));
  await updateDoc(docRef, {
    reviews: arrayUnion(cleanReview)
  });
}

/**
 * Increment likes count for a game
 */
export async function incrementLikesInFirestore(gameId: string): Promise<void> {
  const docRef = doc(db, GAMES_COLLECTION, gameId);
  await updateDoc(docRef, {
    likesCount: increment(1)
  });
}

/**
 * Increment downloads count for a game and specific build
 */
export async function incrementDownloadsInFirestore(gameId: string, buildId?: string): Promise<void> {
  const docRef = doc(db, GAMES_COLLECTION, gameId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as GameProject;
      const updatedDownloads = (data.downloadsCount || 0) + 1;
      let updatedBuilds = data.builds || [];
      if (buildId) {
        updatedBuilds = updatedBuilds.map((b) =>
          b.id === buildId ? { ...b, downloadCount: (b.downloadCount || 0) + 1 } : b
        );
      }
      await updateDoc(docRef, {
        downloadsCount: updatedDownloads,
        builds: updatedBuilds
      });
      return;
    }
  } catch (e) {
    console.warn('Could not update build download count in Firestore, falling back to increment:', e);
  }

  await updateDoc(docRef, {
    downloadsCount: increment(1)
  });
}
