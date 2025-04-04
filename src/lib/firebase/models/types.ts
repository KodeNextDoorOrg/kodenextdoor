/**
 * Core data models and types for Firebase integration
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Firebase document IDs
 */
export type FirebaseDocId = string;

/**
 * Base interface for all document models
 */
export interface BaseDocument {
  id?: FirebaseDocId;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

/**
 * Project model
 */
export interface Project extends BaseDocument {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  features: string[];
  imageUrl: string;
  caseStudyUrl?: string;
  liveUrl?: string;
  order?: number;
  isActive: boolean;
}

/**
 * Service model
 */
export interface Service extends BaseDocument {
  title: string;
  description: string;
  icon: string; // This would store the path or name of the icon
  color: string; // Color theme for the service
  features: string[];
  order?: number;
  isActive: boolean;
}

/**
 * Company stat model for displaying metrics
 */
export interface CompanyStat extends BaseDocument {
  key: string; // Identifier for the stat (e.g., 'yearsExperience', 'projectsCompleted')
  label: string; // Display label (e.g., 'Years of Experience', 'Projects Completed')
  value: number | string;
  prefix?: string; // Optional prefix for display (e.g., '$', '+')
  suffix?: string; // Optional suffix for display (e.g., '%', '+')
  order?: number;
  isActive: boolean;
}

/**
 * Contact information model
 */
export interface ContactInfo extends BaseDocument {
  email: string;
  phone: string;
  address: string;
  businessHours?: {
    weekdays: string;
    weekends: string;
  };
  socialMedia?: {
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  // For backward compatibility with existing code
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  googleMapsUrl?: string;
  socialLinks?: {
    [key: string]: string;
  };
}

/**
 * Business hours model
 */
export interface BusinessHour extends BaseDocument {
  day: string; // Monday, Tuesday, etc.
  isOpen: boolean;
  openTime?: string; // Format: 09:00
  closeTime?: string; // Format: 17:00
  order: number;
}

/**
 * Contact form submission model
 */
export interface ContactSubmission extends BaseDocument {
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  readAt?: string | Timestamp;
}

/**
 * API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

/**
 * Projects API responses
 */
export interface ProjectsResponse extends ApiResponse {
  projects?: Project[];
  project?: Project;
  id?: string;
}

/**
 * Services API responses
 */
export interface ServicesResponse extends ApiResponse {
  services?: Service[];
  service?: Service;
  id?: string;
}

/**
 * Company Stats API responses
 */
export interface CompanyStatsResponse extends ApiResponse {
  companyStats?: CompanyStat[];
  companyStat?: CompanyStat;
  id?: string;
}

/**
 * Contact Info API responses
 */
export interface ContactInfoResponse extends ApiResponse {
  contactInfo?: ContactInfo[];
  contactInfoItem?: ContactInfo;
  id?: string;
}

/**
 * Business Hours API responses
 */
export interface BusinessHoursResponse extends ApiResponse {
  businessHours?: BusinessHour[];
  businessHour?: BusinessHour;
  id?: string;
}

/**
 * Contact Submissions API responses
 */
export interface ContactSubmissionsResponse extends ApiResponse {
  submissions?: ContactSubmission[];
  submission?: ContactSubmission;
  id?: string;
}

export interface FirestoreDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
} 