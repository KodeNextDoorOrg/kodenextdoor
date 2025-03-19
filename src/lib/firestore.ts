import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

// Interface for contact form data
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Timestamp;
}

// Save contact form submission to Firestore
export async function saveContactSubmission(formData: ContactFormData) {
  try {
    const submissionWithTimestamp = {
      ...formData,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(
      collection(db, 'contactSubmissions'), 
      submissionWithTimestamp
    );
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return { success: false, error };
  }
}

// Get recent contact submissions (for admin purposes)
export async function getRecentContactSubmissions(limitCount = 10) {
  try {
    const q = query(
      collection(db, 'contactSubmissions'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: Array<ContactFormData & { id: string }> = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data() as ContactFormData
      });
    });
    
    return { success: true, submissions };
  } catch (error) {
    console.error('Error getting contact submissions:', error);
    return { success: false, error };
  }
} 