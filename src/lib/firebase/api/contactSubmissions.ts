import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { ContactSubmission } from '../models/types';

const COLLECTION_NAME = 'contactSubmissions';
const submissionsCollection = collection(db, COLLECTION_NAME);

/**
 * Save a new contact form submission to the database
 */
export async function saveContactSubmission(formData: Omit<ContactSubmission, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>) {
  try {
    const submissionWithTimestamp = {
      ...formData,
      isRead: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(submissionsCollection, submissionWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return { success: false, error };
  }
}

/**
 * Get a contact submission by ID
 */
export async function getContactSubmissionById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        submission: {
          id: docSnap.id,
          ...docSnap.data()
        } as ContactSubmission
      };
    } else {
      return { success: false, error: 'Submission not found' };
    }
  } catch (error) {
    console.error('Error getting contact submission:', error);
    return { success: false, error };
  }
}

/**
 * Get recent contact form submissions
 */
export async function getRecentContactSubmissions(limitCount = 10) {
  try {
    const q = query(
      submissionsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: ContactSubmission[] = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data() as Omit<ContactSubmission, 'id'>
      });
    });
    
    return { success: true, submissions };
  } catch (error) {
    console.error('Error getting contact submissions:', error);
    return { success: false, error };
  }
}

/**
 * Get unread contact form submissions
 */
export async function getUnreadContactSubmissions() {
  try {
    const q = query(
      submissionsCollection,
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: ContactSubmission[] = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data() as Omit<ContactSubmission, 'id'>
      });
    });
    
    return { success: true, submissions };
  } catch (error) {
    console.error('Error getting unread contact submissions:', error);
    return { success: false, error };
  }
}

/**
 * Mark a contact submission as read
 */
export async function markContactSubmissionAsRead(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { 
      isRead: true,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error marking contact submission as read:', error);
    return { success: false, error };
  }
}

/**
 * Delete a contact submission
 */
export async function deleteContactSubmission(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return { success: false, error };
  }
} 