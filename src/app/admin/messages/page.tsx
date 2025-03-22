'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  isRead: boolean;
  createdAt: Timestamp;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messagesData: ContactSubmission[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as ContactSubmission);
      });
      
      setMessages(messagesData);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Format date from Firestore timestamp
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Unknown date';
    const date = timestamp.toDate();
    return format(date, 'MMM d, yyyy h:mm a');
  };

  // Mark a message as read
  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contactSubmissions', id), {
        isRead: true
      });
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, isRead: true } : msg
        )
      );
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
      
      setSuccessMessage('Message marked as read');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to update message');
    }
  };

  // Delete a message
  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await deleteDoc(doc(db, 'contactSubmissions', id));
      
      setMessages(prev => prev.filter(msg => msg.id !== id));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      
      setSuccessMessage('Message deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
    }
  };

  // Show message details
  const viewMessage = (message: ContactSubmission) => {
    setSelectedMessage(message);
    
    // If message is unread, mark it as read
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  // Get message preview text
  const getMessagePreview = (message: string) => {
    return message.length > 100 ? `${message.substring(0, 100)}...` : message;
  };

  // Get sender name based on available fields
  const getSenderName = (message: ContactSubmission) => {
    if (message.name) return message.name;
    if (message.firstName && message.lastName) return `${message.firstName} ${message.lastName}`;
    if (message.firstName) return message.firstName;
    if (message.lastName) return message.lastName;
    return message.email;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium">Contact Submissions</h1>
        <Link
          href="/admin"
          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages list */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium">Messages ({messages.length})</h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No messages found
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  } ${!message.isRead ? 'border-l-4 border-primary' : ''}`}
                  onClick={() => viewMessage(message)}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className={`font-medium ${!message.isRead ? 'text-primary' : ''}`}>
                      {getSenderName(message)}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {message.subject || 'No subject'}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {getMessagePreview(message.message)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Message details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-medium mb-1">
                    {selectedMessage.subject || 'No subject'}
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    From: {getSenderName(selectedMessage)}
                    {selectedMessage.email && <span> ({selectedMessage.email})</span>}
                  </div>
                  {selectedMessage.phone && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Phone: {selectedMessage.phone}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Received: {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!selectedMessage.isRead && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Mark as read"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              
              {selectedMessage.email && (
                <div className="mt-6">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Reply via Email</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-center h-full min-h-[20rem]">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-xl">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 