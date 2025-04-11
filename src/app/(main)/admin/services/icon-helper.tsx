'use client';

import { useState } from 'react';

interface IconItem {
  name: string;
  svg: string;
}

const commonIcons: IconItem[] = [
  {
    name: 'Web Development',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
  },
  {
    name: 'Mobile App',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>'
  },
  {
    name: 'UI/UX Design',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>'
  },
  {
    name: 'Cloud Services',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>'
  },
  {
    name: 'Database',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>'
  },
  {
    name: 'Analytics',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
  },
  {
    name: 'Security',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>'
  },
  {
    name: 'E-commerce',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
  },
  {
    name: 'API Integration',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>'
  },
  {
    name: 'AI/ML',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>'
  },
  {
    name: 'Support',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
  }
];

export default function IconHelperPage() {
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  
  const filteredIcons = searchTerm 
    ? commonIcons.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commonIcons;
    
  const copyToClipboard = (svg: string) => {
    navigator.clipboard.writeText(svg);
    setCopiedIcon(svg);
    setTimeout(() => setCopiedIcon(null), 2000);
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Icon Helper</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          Select an icon below to use in your services. Click on an icon to copy its SVG code to your clipboard.
        </p>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search icons..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {filteredIcons.map((icon, index) => (
          <div 
            key={index}
            className={`p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedIcon?.name === icon.name ? 'border-primary' : 'border-gray-200'
            }`}
            onClick={() => {
              setSelectedIcon(icon);
              copyToClipboard(icon.svg);
            }}
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-lg mb-2"
                dangerouslySetInnerHTML={{ __html: icon.svg }}
              />
              <div className="text-sm text-center">{icon.name}</div>
              {copiedIcon === icon.svg && (
                <div className="mt-2 text-xs text-green-600">Copied!</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedIcon && (
        <div className="bg-gray-100 p-4 rounded-md mb-8">
          <h2 className="font-semibold mb-2">Selected Icon: {selectedIcon.name}</h2>
          <pre className="bg-white p-3 rounded border overflow-x-auto text-xs">{selectedIcon.svg}</pre>
          <button
            onClick={() => copyToClipboard(selectedIcon.svg)}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {copiedIcon === selectedIcon.svg ? 'Copied!' : 'Copy SVG'}
          </button>
        </div>
      )}
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h2 className="font-semibold mb-2">How to Use:</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Click on an icon to select and copy its SVG code</li>
          <li>When creating or editing a service, paste the copied SVG into the icon field</li>
          <li>Make sure to include the entire SVG code including the opening and closing tags</li>
          <li>Save your service, and the icon will be displayed properly</li>
        </ol>
      </div>
    </div>
  );
} 