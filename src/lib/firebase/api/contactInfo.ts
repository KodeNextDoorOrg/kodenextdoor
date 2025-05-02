import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContactInfo, BusinessHour } from '../models/types';

// Contact Information API
const CONTACT_COLLECTION = 'contact';
const CONTACT_DOC_ID = 'info';

/**
 * Add new contact information to the database
 */
export const saveContactInfo = async (
  contactInfo: Omit<ContactInfo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    // Format the data to match what's in Firestore
    const formattedContactInfo = {
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
      businessHours: {
        weekdays: contactInfo.businessHours?.weekdays || 'Monday - Friday 9:00 am to 5:00 pm',
        weekends: contactInfo.businessHours?.weekends || 'Saturday - Sunday Closed'
      },
      socialMedia: {
        linkedin: contactInfo.socialMedia?.linkedin || contactInfo.linkedin || '',
        github: contactInfo.socialMedia?.github || contactInfo.github || '',
        twitter: contactInfo.socialMedia?.twitter || contactInfo.twitter || '',
      },
      updatedAt: Timestamp.fromDate(new Date())
    };

    await updateDoc(doc(db, CONTACT_COLLECTION, CONTACT_DOC_ID), formattedContactInfo);
    return { success: true, id: CONTACT_DOC_ID };
  } catch (error) {
    console.error('Error saving contact info:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Get contact information 
 */
export const getContactInfo = async (): Promise<ContactInfo | null> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, CONTACT_COLLECTION, CONTACT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Extract social media links
      const socialMedia = data.socialMedia || {};
      const businessHours = data.businessHours || {};
      
      // Transform data to match expected format in the UI
      return { 
        id: CONTACT_DOC_ID, 
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        businessHours: {
          weekdays: businessHours.weekdays || '',
          weekends: businessHours.weekends || ''
        },
        socialMedia: {
          linkedin: socialMedia.linkedin || '',
          github: socialMedia.github || '',
          twitter: socialMedia.twitter || ''
        }
      } as any as ContactInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting contact info:', error);
    return null;
  }
};

/**
 * Get all contact information
 */
export async function getAllContactInfo() {
  try {
    const querySnapshot = await getDocs(collection(db, CONTACT_COLLECTION));
    const contactInfoList: ContactInfo[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const socialLinks = data.socialLinks || {};
      
      contactInfoList.push({
        id: doc.id,
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        googleMapsUrl: data.googleMapsUrl || '',
        facebook: socialLinks.facebook || '',
        twitter: socialLinks.twitter || '',
        instagram: socialLinks.instagram || '',
        linkedin: socialLinks.linkedin || '',
        socialLinks
      } as any as ContactInfo);
    });
    
    return { success: true, contactInfoList };
  } catch (error) {
    console.error('Error getting contact info:', error);
    return { success: false, error: error };
  }
}

/**
 * Get contact information by type (email, phone, address)
 */
export async function getContactInfoByType(type: 'email' | 'phone' | 'address') {
  try {
    const q = query(
      collection(db, CONTACT_COLLECTION),
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    const contactInfoList: ContactInfo[] = [];
    
    querySnapshot.forEach((doc) => {
      contactInfoList.push({
        id: doc.id,
        ...doc.data() as Omit<ContactInfo, 'id'>
      });
    });
    
    return { success: true, contactInfoList };
  } catch (error) {
    console.error('Error getting contact info by type:', error);
    return { success: false, error: error };
  }
}

/**
 * Update contact information
 */
export const updateContactInfo = async (data: Partial<ContactInfo>): Promise<boolean> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    
    const contactInfoRef = doc(db, CONTACT_COLLECTION, CONTACT_DOC_ID);
    await updateDoc(contactInfoRef, data);
    return true;
  } catch (error) {
    console.error('Error updating contact info:', error);
    return false;
  }
};

/**
 * Delete contact information
 */
export async function deleteContactInfo(id: string) {
  try {
    const docRef = doc(db, CONTACT_COLLECTION, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact info:', error);
    return { success: false, error: error };
  }
}

// Business Hours API
const BUSINESS_HOURS_COLLECTION = 'businessHours';
const businessHoursCollection = collection(db, BUSINESS_HOURS_COLLECTION);

/**
 * Save business hours to the database
 */
export const saveBusinessHours = async (
  businessHour: Omit<BusinessHour, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    // Check if a record for this day already exists
    const existingQuery = query(
      collection(db, BUSINESS_HOURS_COLLECTION), 
      where('day', '==', businessHour.day)
    );
    
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      // Update existing record
      const existingDoc = existingDocs.docs[0];
      await updateDoc(doc(db, BUSINESS_HOURS_COLLECTION, existingDoc.id), {
        ...businessHour,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
      return { success: true, id: existingDoc.id };
    }

    // Create new record
    const docRef = await addDoc(collection(db, BUSINESS_HOURS_COLLECTION), {
      ...businessHour,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving business hours:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Get business hours by day
 */
export const getBusinessHoursByDay = async (day: string): Promise<BusinessHour | null> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const q = query(
      collection(db, BUSINESS_HOURS_COLLECTION),
      where('day', '==', day)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as BusinessHour;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting business hours:', error);
    return null;
  }
};

/**
 * Get all business hours
 */
export const getAllBusinessHours = async (): Promise<BusinessHour[]> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const q = query(collection(db, BUSINESS_HOURS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    const hours = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BusinessHour[];
    
    // Sort by day of week
    return hours.sort((a, b) => {
      return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    });
  } catch (error) {
    console.error('Error getting all business hours:', error);
    return [];
  }
};

/**
 * Update business hours
 */
export const updateBusinessHours = async (
  id: string, 
  updates: Partial<BusinessHour>
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, BUSINESS_HOURS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating business hours:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

/**
 * Delete business hours
 */
export const deleteBusinessHours = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');

    await deleteDoc(doc(db, BUSINESS_HOURS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting business hours:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

// Replace any types with more specific types
export const updateContactSubmission = async (id: string, data: Partial<ContactInfo>): Promise<boolean> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    
    const submissionRef = doc(db, 'contactSubmissions', id);
    await updateDoc(submissionRef, data);
    return true;
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return false;
  }
};

// Replace any types with more specific types
export const deleteContactSubmission = async (id: string): Promise<boolean> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    
    const submissionRef = doc(db, 'contactSubmissions', id);
    await deleteDoc(submissionRef);
    return true;
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return false;
  }
}; 