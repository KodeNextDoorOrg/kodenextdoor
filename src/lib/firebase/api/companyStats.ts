import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CompanyStat } from '../models/types';

const COLLECTION_NAME = 'companyStats';

/**
 * Save a new company stat to the database
 */
export const saveCompanyStat = async (
  stat: Omit<CompanyStat, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...stat,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving company stat:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Get a company stat by ID
 */
export const getCompanyStatById = async (id: string): Promise<CompanyStat | null> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CompanyStat;
    }
    return null;
  } catch (error) {
    console.error('Error getting company stat:', error);
    return null;
  }
};

/**
 * Get all company stats
 */
export const getAllCompanyStats = async (): Promise<CompanyStat[]> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CompanyStat[];
  } catch (error) {
    console.error('Error getting company stats:', error);
    return [];
  }
};

/**
 * Update an existing company stat
 */
export const updateCompanyStat = async (
  id: string, 
  updates: Partial<CompanyStat>
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating company stat:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Delete a company stat
 */
export const deleteCompanyStat = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting company stat:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}; 