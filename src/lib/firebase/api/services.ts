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
  where,
  serverTimestamp,
  QueryConstraint,
  FirestoreError
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '../models/types';

const COLLECTION_NAME = 'services';

/**
 * Save a new service to the database
 */
export const saveService = async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...service,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving service:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Get a service by ID
 */
export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Service;
    }
    return null;
  } catch (error) {
    console.error('Error getting service:', error);
    return null;
  }
};

/**
 * Get all services
 */
export const getAllServices = async (activeOnly: boolean = false): Promise<Service[]> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const constraints: QueryConstraint[] = [orderBy('order', 'asc')];
    
    if (activeOnly) {
      constraints.push(where('isActive', '==', true));
    }
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  } catch (error) {
    console.error('Error getting services:', error);
    return [];
  }
};

/**
 * Update an existing service
 */
export const updateService = async (id: string, updates: Partial<Service>): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating service:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Delete a service
 */
export const deleteService = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}; 