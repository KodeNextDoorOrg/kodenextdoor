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
import { Project } from '../models/types';

const COLLECTION_NAME = 'projects';

/**
 * Save a new project to the database
 */
export const saveProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving project:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Get a project by ID
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  } catch (error) {
    console.error('Error getting project:', error);
    return null;
  }
};

/**
 * Get all projects
 */
export const getAllProjects = async (activeOnly: boolean = false): Promise<Project[]> => {
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
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

/**
 * Get projects by category
 */
export const getProjectsByCategory = async (category: string): Promise<Project[]> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects by category:', error);
    return [];
  }
};

/**
 * Get featured projects
 */
export async function getFeaturedProjects(limitCount = 6) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isFeatured', '==', true),
      orderBy('sortOrder', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data() as Omit<Project, 'id'>
      });
    });
    
    return { success: true, projects };
  } catch (error) {
    console.error('Error getting featured projects:', error);
    return { success: false, error };
  }
}

/**
 * Update an existing project
 */
export const updateProject = async (id: string, updates: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    const errorMessage = error instanceof FirestoreError 
      ? error.message 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}; 