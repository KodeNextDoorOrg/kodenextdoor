import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CompanyInfo {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  aboutUs: string;
  mission: string;
  vision: string;
}

/**
 * Get company information from Firestore
 */
export const getCompanyInfo = async (): Promise<CompanyInfo | null> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    
    const docRef = doc(db, 'companyInfo', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CompanyInfo;
    }
    
    // Return default values if no document exists
    return {
      yearsExperience: 10,
      projectsCompleted: 150,
      clientSatisfaction: 95,
      aboutUs: 'At Kode Next Door, we are a team of passionate developers, designers, and strategists dedicated to transforming ideas into exceptional digital solutions.',
      mission: 'Our mission is to empower businesses through innovative technology solutions.',
      vision: 'To be the leading provider of digital transformation solutions that drive business growth.'
    };
  } catch (error) {
    console.error('Error getting company info:', error);
    return null;
  }
}; 