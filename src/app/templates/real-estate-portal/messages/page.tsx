"use client";

import React, { useState } from 'react';
import "@/app/templates/real-estate-portal/styles/template.css";
import { Home, FileText, Wrench, CreditCard, Bell, Settings, Calendar, Eye, Check, Clock, Download, Send, Mail, User, Search, ChevronRight, MessageCircle, Edit, Trash } from "lucide-react";
import Link from 'next/link';
import Layout from '../components/Layout';

const MessagesPage = () => {
  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  
  const conversations = [
    { 
      id: 1, 
      with: 'Property Manager',
      avatar: 'PM',
      unread: true,
      lastMessage: 'Hello Jane, I wanted to follow up on your...',
      lastDate: '2024-04-05',
      messages: [
        { id: 1, sender: 'them', text: 'Hello Jane, I wanted to follow up on your maintenance request from last week. The technician is scheduled to visit tomorrow between 10am-12pm. Will you be available during this time?', time: '2024-04-05 09:32' },
        { id: 2, sender: 'me', text: 'Hi, yes I will be available during that time. Thank you for scheduling it so quickly!', time: '2024-04-05 10:15' },
        { id: 3, sender: 'them', text: 'Perfect! The technician will call you about 30 minutes before arrival. If you have any questions before then, please let me know.', time: '2024-04-05 10:20' },
      ]
    },
    { 
      id: 2, 
      with: 'Maintenance Team',
      avatar: 'MT',
      unread: true,
      lastMessage: 'We\'ve received your request and will be...',
      lastDate: '2024-04-03',
      messages: [
        { id: 1, sender: 'them', text: 'We\'ve received your request about the AC unit not cooling properly. Based on your description, it sounds like it might be a refrigerant issue. We\'ll need to send a technician to check it out.', time: '2024-04-02 14:45' },
        { id: 2, sender: 'me', text: 'Thank you for the quick response. The apartment is getting quite warm, especially in the afternoon. Is there any way to get this addressed soon?', time: '2024-04-02 15:30' },
        { id: 3, sender: 'them', text: 'We\'ve escalated this to a priority repair. A technician has been scheduled for tomorrow (April 3rd) between 1pm-3pm. Will that work for you?', time: '2024-04-02 16:15' },
        { id: 4, sender: 'me', text: 'Yes, that works perfectly. I\'ll be home during that time. Thank you!', time: '2024-04-02 16:30' },
        { id: 5, sender: 'them', text: 'We\'ve received your request and will be there as scheduled. Please make sure the area around the AC unit is accessible.', time: '2024-04-03 08:15' },
      ]
    },
    { 
      id: 3, 
      with: 'Leasing Office',
      avatar: 'LO',
      unread: false,
      lastMessage: 'Your lease renewal documents have been...',
      lastDate: '2024-03-20',
      messages: [
        { id: 1, sender: 'them', text: 'Hello Jane, your lease is coming up for renewal on April 30th. Would you like to proceed with renewal for another year?', time: '2024-03-15 11:30' },
        { id: 2, sender: 'me', text: 'Yes, I would like to renew. Could you please send me the renewal terms?', time: '2024-03-15 13:45' },
        { id: 3, sender: 'them', text: 'Great! We\'re pleased to have you continue your residency with us. The renewal terms will be the same as your current lease with a 3% increase in monthly rent ($1,250 to $1,288). Would you like me to prepare the documents?', time: '2024-03-16 10:20' },
        { id: 4, sender: 'me', text: 'That sounds reasonable. Yes, please prepare the documents and I\'ll review them.', time: '2024-03-16 12:05' },
        { id: 5, sender: 'them', text: 'Your lease renewal documents have been uploaded to your portal under Documents > Lease Agreement. Please review and sign electronically by March 30th.', time: '2024-03-20 15:30' },
      ]
    },
  ];

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const formatConversationDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    if (date.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !activeConversation) return;
    
    // In a real app, you would send this to an API
    console.log('Sending message:', newMessage, 'to conversation:', activeConversation);
    
    // For demo purposes, we're just updating the UI
    setNewMessage('');
  };

  return (
    <Layout>
      {/* Main Content */}
      <main className="rep-main-content">
        {/* Header */}
        <header className="rep-content-header">
          <h1>Messages</h1>
          <div className="rep-header-user-info">
            <Bell size={20} />
            <div className="rep-user-avatar">JD</div>
            <div className="rep-user-name">Jane Doe</div>
          </div>
        </header>

        {/* Messages Interface */}
        <div className="rep-card rep-fade-in p-0 overflow-hidden">
          <div className="flex h-[calc(80vh-10rem)]">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-[--rep-border-color]">
              <div className="p-4 border-b border-[--rep-border-color] flex justify-between items-center">
                <h2 className="font-medium text-lg">Conversations</h2>
                <button className="text-[--rep-primary] hover:text-[--rep-secondary] rounded-full p-2 hover:bg-[--rep-primary-light]">
                  <Edit size={20} />
                </button>
              </div>
              
              <div className="p-3 border-b border-[--rep-border-color]">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full px-4 py-2 pl-9 border border-[--rep-border-color] rounded-lg focus:outline-none focus:ring-1 focus:ring-[--rep-primary] focus:border-transparent text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[--rep-text-secondary]" />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-110px)]">
                {conversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`p-3 border-b border-[--rep-border-color] hover:bg-gray-50 cursor-pointer flex items-center ${activeConversation === conversation.id ? 'bg-[--rep-primary-light]' : ''} ${conversation.unread ? 'bg-blue-50' : ''}`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${conversation.unread ? 'bg-[--rep-primary]' : 'bg-[--rep-secondary]'} mr-3`}>
                      {conversation.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.with}</h3>
                        <span className="text-xs text-[--rep-text-secondary] whitespace-nowrap ml-2">
                          {formatConversationDate(conversation.lastDate)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-[--rep-text-primary]' : 'text-[--rep-text-secondary]'}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="w-3 h-3 bg-[--rep-primary] rounded-full ml-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message View */}
            <div className="w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="p-4 border-b border-[--rep-border-color] flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[--rep-secondary] mr-3">
                        {conversations.find(c => c.id === activeConversation)?.avatar}
                      </div>
                      <h2 className="font-medium text-lg">{conversations.find(c => c.id === activeConversation)?.with}</h2>
                    </div>
                    <div className="flex">
                      <button className="text-[--rep-text-secondary] hover:text-[--rep-text-primary] mr-2">
                        <Search size={18} />
                      </button>
                      <button className="text-[--rep-text-secondary] hover:text-[--rep-danger]">
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations.find(c => c.id === activeConversation)?.messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'me' 
                              ? 'bg-[--rep-primary] text-white rounded-tr-none' 
                              : 'bg-gray-100 text-[--rep-text-primary] rounded-tl-none'
                          }`}
                        >
                          <div className="text-sm">{message.text}</div>
                          <div className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-100' : 'text-[--rep-text-secondary]'}`}>
                            {formatMessageDate(message.time)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-[--rep-border-color]">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full px-4 py-2 border border-[--rep-border-color] rounded-lg focus:outline-none focus:ring-1 focus:ring-[--rep-primary] focus:border-transparent text-sm resize-none h-12"
                        ></textarea>
                      </div>
                      <button 
                        className={`ml-2 p-3 rounded-full ${newMessage.trim() ? 'bg-[--rep-primary] text-white' : 'bg-gray-100 text-[--rep-text-secondary]'}`}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center flex-col text-center p-6">
                  <MessageCircle size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
                  <p className="text-[--rep-text-secondary] max-w-md">
                    Select a conversation from the list to view messages, or start a new conversation by clicking the edit icon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Contacts */}
        <div className="rep-card rep-fade-in mt-6">
          <div className="rep-card-header">
            <User /> Quick Contacts
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="p-4 border border-[--rep-border-color] rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-1">Property Manager</h3>
              <div className="text-sm text-[--rep-text-secondary] mb-2">Available: Mon-Fri, 9am-5pm</div>
              <div className="flex mt-3">
                <button className="rep-btn rep-btn-outline py-1 px-3 text-xs">
                  <Mail size={14} className="mr-1" /> Message
                </button>
                <span className="flex-1"></span>
                <button className="text-[--rep-primary] hover:text-[--rep-secondary]">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 border border-[--rep-border-color] rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-1">Maintenance Team</h3>
              <div className="text-sm text-[--rep-text-secondary] mb-2">Available: 24/7 for emergencies</div>
              <div className="flex mt-3">
                <button className="rep-btn rep-btn-outline py-1 px-3 text-xs">
                  <Mail size={14} className="mr-1" /> Message
                </button>
                <span className="flex-1"></span>
                <button className="text-[--rep-primary] hover:text-[--rep-secondary]">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 border border-[--rep-border-color] rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-1">Leasing Office</h3>
              <div className="text-sm text-[--rep-text-secondary] mb-2">Available: Mon-Sat, 10am-6pm</div>
              <div className="flex mt-3">
                <button className="rep-btn rep-btn-outline py-1 px-3 text-xs">
                  <Mail size={14} className="mr-1" /> Message
                </button>
                <span className="flex-1"></span>
                <button className="text-[--rep-primary] hover:text-[--rep-secondary]">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default MessagesPage; 