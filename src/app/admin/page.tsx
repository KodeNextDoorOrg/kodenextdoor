'use client';

import { useEffect, useState } from 'react';
import { getRecentContactSubmissions } from '@/lib/firestore';
import { useFirebase } from '@/context/FirebaseContext';
import { Timestamp } from 'firebase/firestore';

interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useFirebase();

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        // In a real application, you would check if the user is authenticated here
        // For now, we're just fetching the data without authentication

        const result = await getRecentContactSubmissions(20);
        if (result.success) {
          setSubmissions(result.submissions as Submission[]);
        } else {
          setError('Failed to load submissions');
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-light dark:from-background dark:to-gray-dark p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="bg-white/90 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6">Contact Form Submissions</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No submissions yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr 
                      key={submission.id} 
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {submission.firstName} {submission.lastName}
                      </td>
                      <td className="px-4 py-3">{submission.email}</td>
                      <td className="px-4 py-3">{submission.subject}</td>
                      <td className="px-4 py-3">
                        {submission.createdAt ? formatDate(submission.createdAt) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Note: In a production application, this page would be protected with authentication.
        </p>
      </div>
    </div>
  );
} 