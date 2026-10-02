import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { DiaryEntry } from '../types/diary';

// User-provided Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAOHl0FAHC6haDxXMpuNKdA6bRJXwOrjrk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visit-e95d1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visit-e95d1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visit-e95d1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "707774967373",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:707774967373:web:646aefa243bb98e180b604",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

const LOCAL_STORAGE_KEY = 'warm_daily_diaries_cache';

// Helper to get local cache
function getLocalCache(): DiaryEntry[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to read localStorage:', e);
    return [];
  }
}

// Helper to save local cache
function setLocalCache(entries: DiaryEntry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn('Failed to write to localStorage:', e);
  }
}

/**
 * Save a new diary entry with AI response to Firestore (and localStorage cache)
 */
export async function saveDiaryEntry(
  entry: Omit<DiaryEntry, 'id' | 'createdAt'>
): Promise<DiaryEntry> {
  const newEntry: DiaryEntry = {
    ...entry,
    id: `diary_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
  };

  // Always update local cache first for instant responsiveness
  const currentEntries = getLocalCache();
  const updatedEntries = [newEntry, ...currentEntries.filter((e) => e.id !== newEntry.id)];
  setLocalCache(updatedEntries);

  // Attempt to write to Firestore
  try {
    const diariesCol = collection(db, 'diaries');
    const docRef = await addDoc(diariesCol, {
      ...newEntry,
      firestoreCreatedAt: serverTimestamp(),
    });

    if (docRef.id) {
      newEntry.id = docRef.id;
      // Sync local cache with Firestore ID
      setLocalCache([newEntry, ...currentEntries.filter((e) => e.id !== newEntry.id)]);
    }
  } catch (error) {
    console.warn('Firestore write notice (cached locally):', error);
  }

  return newEntry;
}

/**
 * Fetch all diary entries from Firestore, falling back to local storage
 */
export async function fetchDiaryEntries(): Promise<DiaryEntry[]> {
  const localList = getLocalCache();

  try {
    const diariesCol = collection(db, 'diaries');
    const q = query(diariesCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const remoteList: DiaryEntry[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          date: data.date,
          emotion: data.emotion,
          content: data.content,
          tags: data.tags || [],
          aiResponse: data.aiResponse,
          actionCompleted: !!data.actionCompleted,
          createdAt: data.createdAt || Date.now(),
        };
      });

      // Merge remote & local deduplicated
      const mergedMap = new Map<string, DiaryEntry>();
      remoteList.forEach((item) => mergedMap.set(item.id, item));
      localList.forEach((item) => {
        if (!mergedMap.has(item.id)) {
          mergedMap.set(item.id, item);
        }
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );
      setLocalCache(merged);
      return merged;
    }
  } catch (error) {
    console.warn('Firestore fetch notice (using local cache):', error);
  }

  return localList;
}

/**
 * Toggle tomorrow's action completion status
 */
export async function toggleActionCompleted(id: string, completed: boolean): Promise<void> {
  const current = getLocalCache();
  const updated = current.map((item) =>
    item.id === id ? { ...item, actionCompleted: completed } : item
  );
  setLocalCache(updated);

  try {
    const docRef = doc(db, 'diaries', id);
    await updateDoc(docRef, { actionCompleted: completed });
  } catch (e) {
    console.warn('Firestore update completed notice:', e);
  }
}

/**
 * Delete a diary entry
 */
export async function deleteDiaryEntry(id: string): Promise<void> {
  const current = getLocalCache();
  setLocalCache(current.filter((item) => item.id !== id));

  try {
    const docRef = doc(db, 'diaries', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore delete notice:', e);
  }
}
