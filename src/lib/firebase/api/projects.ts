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
  FirestoreError,
  limit
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
export const getAllProjects = async (activeOnly: boolean = false): Promise<{ success: boolean; projects?: Project[]; error?: unknown }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    
    // Add constraints
    const constraints: QueryConstraint[] = [];
    
    if (activeOnly) {
      constraints.push(where('isActive', '!=', false));
    }
    
    // We'll query without ordering first to avoid errors if 'order' field doesn't exist
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const projects = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Ensure technologies and features are arrays
      let technologies = [];
      if (Array.isArray(data.technologies)) {
        technologies = data.technologies;
      } else if (typeof data.technologies === 'string') {
        technologies = data.technologies.split(',').map((t: string) => t.trim());
      }
      
      let features = [];
      if (Array.isArray(data.features)) {
        features = data.features;
      } else if (typeof data.features === 'string') {
        features = data.features.split(',').map((f: string) => f.trim());
      } else {
        // Default features if none exist
        features = ['No features specified'];
      }
      
      // Build a complete project object with fallbacks for missing fields
      return {
        id: doc.id,
        title: data.title || 'Untitled Project',
        description: data.description || 'No description available.',
        category: data.category || 'Web Development',
        technologies: technologies.length > 0 ? technologies : ['Not specified'],
        features: features,
        imageUrl: data.imageUrl || '',
        image: data.imageUrl || '',
        isActive: data.isActive !== false, // Default to true
        link: data.liveUrl || data.caseStudyUrl || '#',
        order: data.order || 0
      } as unknown as Project;
    });
    
    // Sort projects by order field after creation
    projects.sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 0;
      const orderB = typeof b.order === 'number' ? b.order : 0;
      return orderA - orderB;
    });
    
    return { success: true, projects };
  } catch (error) {
    console.error('Error getting projects:', error);
    return { success: false, error };
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
    if (!db) throw new Error('Firestore is not initialized');
    
    console.log('Fetching featured projects...');
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isFeatured', '==', true),
      where('isActive', '==', true),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} featured projects`);
    
    const projects = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Ensure technologies and features are arrays
      let technologies = [];
      if (Array.isArray(data.technologies)) {
        technologies = data.technologies;
      } else if (typeof data.technologies === 'string') {
        technologies = data.technologies.split(',').map((t: string) => t.trim());
      }
      
      let features = [];
      if (Array.isArray(data.features)) {
        features = data.features;
      } else if (typeof data.features === 'string') {
        features = data.features.split(',').map((f: string) => f.trim());
      }
      
      return {
        id: doc.id,
        title: data.title || 'Untitled Project',
        description: data.description || '',
        category: data.category || 'Web Development',
        technologies: technologies,
        features: features,
        imageUrl: data.imageUrl || '',
        image: data.imageUrl || '',
        isActive: data.isActive !== false, // Default to true
        link: data.liveUrl || data.caseStudyUrl || '#'
      } as unknown as Project;
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