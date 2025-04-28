"use client";

import React, { useState } from 'react';
import "@/app/templates/real-estate-portal/styles/template.css";
import { Home, FileText, Wrench, CreditCard, Bell, Settings, Calendar, Eye, Check, Clock, Download, Send, Mail, FileIcon, FolderIcon, Search, File } from "lucide-react";
import Link from 'next/link';
import Layout from '../components/Layout';

const DocumentsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const documentCategories = [
    { id: 'lease', name: 'Lease Agreement', icon: FileText },
    { id: 'policy', name: 'Policies & Rules', icon: FileIcon },
    { id: 'forms', name: 'Forms', icon: File },
    { id: 'notices', name: 'Notices', icon: Bell },
  ];

  const documents = [
    { 
      id: 1, 
      title: 'Lease Agreement', 
      category: 'lease',
      date: '2023-05-01', 
      size: '1.2 MB',
      extension: 'pdf',
      important: true
    },
    { 
      id: 2, 
      title: 'Community Rules & Guidelines', 
      category: 'policy',
      date: '2023-05-01', 
      size: '850 KB',
      extension: 'pdf',
      important: false
    },
    { 
      id: 3, 
      title: 'Parking Policy', 
      category: 'policy',
      date: '2023-05-01', 
      size: '320 KB',
      extension: 'pdf',
      important: false
    },
    { 
      id: 4, 
      title: 'Maintenance Request Form', 
      category: 'forms',
      date: '2023-05-01', 
      size: '105 KB',
      extension: 'pdf',
      important: false
    },
    { 
      id: 5, 
      title: 'Move-Out Checklist', 
      category: 'forms',
      date: '2023-05-01', 
      size: '215 KB',
      extension: 'pdf',
      important: false
    },
    { 
      id: 6, 
      title: 'Rent Increase Notice - 2024', 
      category: 'notices',
      date: '2024-03-01', 
      size: '95 KB',
      extension: 'pdf',
      important: true
    },
    { 
      id: 7, 
      title: 'Building Maintenance Schedule', 
      category: 'notices',
      date: '2024-01-15', 
      size: '180 KB',
      extension: 'pdf',
      important: false
    },
    { 
      id: 8, 
      title: 'Lease Renewal Option', 
      category: 'lease',
      date: '2024-03-15', 
      size: '320 KB',
      extension: 'pdf',
      important: true
    },
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getIconForDocument = (document) => {
    switch (document.extension) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="text-green-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  return (
    <Layout>
      {/* Main Content */}
      <main className="rep-main-content">
        {/* Header */}
        <header className="rep-content-header">
          <h1>Lease & Documents</h1>
          <div className="rep-header-user-info">
            <Bell size={20} />
            <div className="rep-user-avatar">JD</div>
            <div className="rep-user-name">Jane Doe</div>
          </div>
        </header>

        {/* Current Lease Status */}
        <div className="rep-metrics-card rep-fade-in">
          <div className="rep-metrics-header">
            <h2>Lease Information</h2>
            <button className="rep-btn rep-btn-outline">
              <Download size={16} /> Download Lease
            </button>
          </div>
          <div className="rep-metrics-grid">
            <div className="rep-metric-item">
              <div className="rep-metric-value">May 1, 2023</div>
              <div className="rep-metric-label">Start Date</div>
            </div>
            <div className="rep-metric-item">
              <div className="rep-metric-value">April 30, 2024</div>
              <div className="rep-metric-label">End Date</div>
            </div>
            <div className="rep-metric-item">
              <div className="rep-metric-value">30 days</div>
              <div className="rep-metric-label">Remaining</div>
            </div>
            <div className="rep-metric-item">
              <div className="rep-metric-value">$1,250</div>
              <div className="rep-metric-label">Monthly Rent</div>
            </div>
          </div>
        </div>

        {/* Document Search & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Search */}
          <div className="lg:col-span-1">
            <div className="rep-card h-full">
              <div className="rep-card-header">
                <Search /> Document Search
              </div>
              <div className="relative mt-2">
                <input 
                  type="text" 
                  placeholder="Search documents..." 
                  className="w-full px-4 py-2 border border-[--rep-border-color] rounded-lg focus:outline-none focus:ring-2 focus:ring-[--rep-primary] focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-[--rep-text-secondary]" />
              </div>
              
              <div className="mt-6">
                <div className="text-sm font-medium text-[--rep-text-secondary] mb-2">CATEGORIES</div>
                <ul className="space-y-1">
                  <li>
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${selectedCategory === 'all' ? 'bg-[--rep-primary-light] text-[--rep-primary] font-medium' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      <FolderIcon className="w-4 h-4 mr-2" />
                      <span>All Documents</span>
                      <span className="ml-auto bg-gray-100 text-[--rep-text-secondary] text-xs px-2 py-0.5 rounded-full">{documents.length}</span>
                    </button>
                  </li>
                  {documentCategories.map(category => (
                    <li key={category.id}>
                      <button 
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${selectedCategory === category.id ? 'bg-[--rep-primary-light] text-[--rep-primary] font-medium' : 'hover:bg-gray-100'}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <category.icon className="w-4 h-4 mr-2" />
                        <span>{category.name}</span>
                        <span className="ml-auto bg-gray-100 text-[--rep-text-secondary] text-xs px-2 py-0.5 rounded-full">
                          {documents.filter(doc => doc.category === category.id).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="lg:col-span-3">
            <div className="rep-list-container h-full">
              <div className="rep-list-header">
                <h2>
                  <FileText /> 
                  {selectedCategory === 'all' ? 'All Documents' : 
                    documentCategories.find(c => c.id === selectedCategory)?.name || 'Documents'}
                </h2>
                <div>
                  <select className="bg-white border border-[--rep-border-color] rounded-md text-sm py-1 px-3">
                    <option>Date (Newest)</option>
                    <option>Date (Oldest)</option>
                    <option>Name (A-Z)</option>
                    <option>Name (Z-A)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map(document => (
                  <div 
                    key={document.id} 
                    className={`p-4 border border-[--rep-border-color] rounded-lg hover:shadow-md transition-shadow flex items-start ${document.important ? 'bg-[--rep-primary-light] border-[--rep-primary] border-opacity-30' : 'bg-white'}`}
                  >
                    <div className="rounded-lg bg-gray-100 p-3 mr-3">
                      {getIconForDocument(document)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[--rep-text-primary]">
                        {document.title}
                        {document.important && (
                          <span className="ml-2 text-xs bg-[--rep-primary] text-white px-2 py-0.5 rounded-full">Important</span>
                        )}
                      </h3>
                      <div className="text-xs text-[--rep-text-secondary] mt-1 space-y-1">
                        <div>Category: {documentCategories.find(c => c.id === document.category)?.name}</div>
                        <div className="flex justify-between">
                          <span>Added: {document.date}</span>
                          <span>Size: {document.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[--rep-primary] hover:text-[--rep-secondary] rounded-full p-1 ml-2 hover:bg-[--rep-primary-light]">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {filteredDocuments.length === 0 && (
                <div className="text-center py-10 text-[--rep-text-secondary]">
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No documents found in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Document Upload */}
        <div className="rep-card rep-fade-in bg-[--rep-primary-light]">
          <div className="rep-card-header text-[--rep-primary]">
            <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Submit Documents
          </div>
          <div className="mt-2">
            <p className="mb-4">Need to submit documents to management? You can upload files directly here:</p>
            <div className="border-2 border-dashed border-[--rep-primary] border-opacity-50 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto text-[--rep-primary] opacity-50 mb-3" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-[--rep-text-secondary] mb-2">Drag and drop files here, or click to select files</p>
              <p className="text-xs text-[--rep-text-secondary]">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max size: 10MB)</p>
              <button className="rep-btn rep-btn-primary mt-4">
                <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                Upload Files
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default DocumentsPage; 