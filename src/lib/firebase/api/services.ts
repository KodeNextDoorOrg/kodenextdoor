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

    console.log('getAllServices called with activeOnly =', activeOnly);
    
    // Get all services without filtering in the query
    const allServicesQuery = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(allServicesQuery);
    
    console.log('Found', querySnapshot.docs.length, 'total services');
    
    // Map all services and normalize the isActive property
    const allServices = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // *** Add logging here to inspect the raw icon data ***
      console.log(`Service ${doc.id} - Raw data icon:`, {
        iconValue: data.icon,
        iconType: typeof data.icon,
        dataObject: data // Log the whole data object for context
      });
      // *** End added logging ***
      
      // Normalize isActive to a boolean value regardless of its original type
      // Handle various data types: boolean, string, number
      let isActive: boolean;
      
      if (data.isActive === undefined || data.isActive === null) {
        // Default to false if not set
        isActive = false;
      } else if (typeof data.isActive === 'boolean') {
        // Direct boolean
        isActive = data.isActive;
      } else if (typeof data.isActive === 'string') {
        // String 'true' or 'false'
        isActive = data.isActive.toLowerCase() === 'true';
      } else if (typeof data.isActive === 'number') {
        // Number 1 or 0
        isActive = data.isActive !== 0;
      } else {
        // Any other type, convert to boolean
        isActive = Boolean(data.isActive);
      }
      
      console.log(`Service ${doc.id} (${data.title || 'unnamed'}) isActive:`, {
        original: data.isActive,
        originalType: typeof data.isActive,
        normalized: isActive
      });
      
      // Return the service with normalized isActive and ensure all properties are present
      // Explicitly cast to Service to satisfy TypeScript
      return {
        id: doc.id,
        title: data.title || '', // Provide default values if necessary
        description: data.description || '',
        icon: data.icon || '',
        color: data.color || '',
        features: data.features || [],
        order: data.order !== undefined ? data.order : 0, // Ensure order has a default
        // We keep the original Firestore Timestamps for createdAt/updatedAt if needed, 
        // or handle their conversion elsewhere if required.
        // For now, let's assume the Service type expects them as they are from Firestore
        // or that they are handled correctly downstream.
        createdAt: data.createdAt, 
        updatedAt: data.updatedAt,
        isActive: isActive, // Use the normalized value
      } as Service; // Cast to Service type
    });
    
    // If activeOnly is true, filter for only active services
    const results = activeOnly 
      ? allServices.filter(service => service.isActive === true)
      : allServices;
    
    console.log('Returning', results.length, 'services (filtered by activeOnly:', activeOnly, ')');
    return results;
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

/**
 * Reorder services to match a new order
 */
export async function reorderServices(serviceIds: string[]): Promise<boolean> {
  try {
    const updates = serviceIds.map((id, index) => {
      const serviceRef = doc(db, COLLECTION_NAME, id);
      return updateDoc(serviceRef, { order: index });
    });
    
    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error reordering services:', error);
    return false;
  }
} 