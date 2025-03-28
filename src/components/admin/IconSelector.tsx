'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  FaLaptopCode, FaMobileAlt, FaPalette, FaCloud, FaLock, FaChartLine, 
  FaDatabase, FaCogs, FaRobot, FaBullhorn, FaUserFriends, FaBriefcase,
  FaCode, FaServer, FaNetworkWired, FaShoppingCart, FaUsers, FaHandshake,
  FaHeadset, FaChartBar, FaClipboardCheck, FaTools, FaPuzzlePiece, FaSyncAlt
} from 'react-icons/fa';

import {
  AiOutlineApi, AiOutlineAppstore, AiOutlineAreaChart, AiOutlineAudit,
  AiOutlineBlock, AiOutlineCloud, AiOutlineCloudServer, AiOutlineCodepen,
  AiOutlineDashboard, AiOutlineDatabase, AiOutlineDeploymentUnit, AiOutlineDesktop,
  AiOutlineMobile, AiOutlineRocket, AiOutlineSafety, AiOutlineSetting
} from 'react-icons/ai';

import {
  BiCodeAlt, BiData, BiDevices, BiBrain, BiGlobe, BiWrench,
  BiShield, BiSupport, BiTestTube, BiTrophy
} from 'react-icons/bi';

// Icon map to easily render the icons
const iconComponents = {
  // FontAwesome icons
  FaLaptopCode, FaMobileAlt, FaPalette, FaCloud, FaLock, FaChartLine,
  FaDatabase, FaCogs, FaRobot, FaBullhorn, FaUserFriends, FaBriefcase,
  FaCode, FaServer, FaNetworkWired, FaShoppingCart, FaUsers, FaHandshake,
  FaHeadset, FaChartBar, FaClipboardCheck, FaTools, FaPuzzlePiece, FaSyncAlt,
  
  // Ant Design icons
  AiOutlineApi, AiOutlineAppstore, AiOutlineAreaChart, AiOutlineAudit,
  AiOutlineBlock, AiOutlineCloud, AiOutlineCloudServer, AiOutlineCodepen,
  AiOutlineDashboard, AiOutlineDatabase, AiOutlineDeploymentUnit, AiOutlineDesktop,
  AiOutlineMobile, AiOutlineRocket, AiOutlineSafety, AiOutlineSetting,
  
  // Boxicons
  BiCodeAlt, BiData, BiDevices, BiBrain, BiGlobe, BiWrench,
  BiShield, BiSupport, BiTestTube, BiTrophy
};

// Type for the icon components
type IconName = keyof typeof iconComponents;

// IconData with display info
interface IconData {
  name: IconName;
  category: 'Tech' | 'Business' | 'Design' | 'Other';
}

// Group icons by category
const iconsByCategory: Record<string, IconData[]> = {
  'Tech': [
    { name: 'FaLaptopCode', category: 'Tech' },
    { name: 'FaMobileAlt', category: 'Tech' },
    { name: 'FaCloud', category: 'Tech' },
    { name: 'FaDatabase', category: 'Tech' },
    { name: 'FaCode', category: 'Tech' },
    { name: 'FaServer', category: 'Tech' },
    { name: 'FaNetworkWired', category: 'Tech' },
    { name: 'AiOutlineApi', category: 'Tech' },
    { name: 'AiOutlineCloud', category: 'Tech' },
    { name: 'AiOutlineCloudServer', category: 'Tech' },
    { name: 'AiOutlineCodepen', category: 'Tech' },
    { name: 'AiOutlineDatabase', category: 'Tech' },
    { name: 'AiOutlineDesktop', category: 'Tech' },
    { name: 'AiOutlineMobile', category: 'Tech' },
    { name: 'BiCodeAlt', category: 'Tech' },
    { name: 'BiData', category: 'Tech' },
    { name: 'BiDevices', category: 'Tech' }
  ],
  'Business': [
    { name: 'FaChartLine', category: 'Business' },
    { name: 'FaBullhorn', category: 'Business' },
    { name: 'FaUserFriends', category: 'Business' },
    { name: 'FaBriefcase', category: 'Business' },
    { name: 'FaShoppingCart', category: 'Business' },
    { name: 'FaUsers', category: 'Business' },
    { name: 'FaHandshake', category: 'Business' },
    { name: 'FaHeadset', category: 'Business' },
    { name: 'FaChartBar', category: 'Business' },
    { name: 'AiOutlineAreaChart', category: 'Business' },
    { name: 'AiOutlineAudit', category: 'Business' },
    { name: 'AiOutlineDashboard', category: 'Business' },
    { name: 'BiTrophy', category: 'Business' }
  ],
  'Design': [
    { name: 'FaPalette', category: 'Design' },
    { name: 'FaPuzzlePiece', category: 'Design' },
    { name: 'AiOutlineAppstore', category: 'Design' },
    { name: 'BiGlobe', category: 'Design' }
  ],
  'Other': [
    { name: 'FaLock', category: 'Other' },
    { name: 'FaCogs', category: 'Other' },
    { name: 'FaRobot', category: 'Other' },
    { name: 'FaClipboardCheck', category: 'Other' },
    { name: 'FaTools', category: 'Other' },
    { name: 'FaSyncAlt', category: 'Other' },
    { name: 'AiOutlineBlock', category: 'Other' },
    { name: 'AiOutlineDeploymentUnit', category: 'Other' },
    { name: 'AiOutlineRocket', category: 'Other' },
    { name: 'AiOutlineSafety', category: 'Other' },
    { name: 'AiOutlineSetting', category: 'Other' },
    { name: 'BiBrain', category: 'Other' },
    { name: 'BiWrench', category: 'Other' },
    { name: 'BiShield', category: 'Other' },
    { name: 'BiSupport', category: 'Other' },
    { name: 'BiTestTube', category: 'Other' }
  ]
};

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function IconSelector({ value, onChange, className = '' }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Parse current value to find selected icon
  useEffect(() => {
    if (value) {
      // Try to find the icon in our list
      for (const category in iconsByCategory) {
        const found = iconsByCategory[category].find(icon => {
          const IconComponent = iconComponents[icon.name];
          const svgString = IconComponent 
            ? `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">`
            : '';
          return value.includes(svgString);
        });
        
        if (found) {
          setSelectedIcon(found.name);
          break;
        }
      }
    }
  }, [value]);
  
  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Filter icons based on search term and selected category
  const filteredIcons = Object.entries(iconsByCategory)
    .filter(([category]) => !selectedCategory || category === selectedCategory)
    .flatMap(([, icons]) =>
      icons.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
  // Handle icon selection
  const handleSelectIcon = (iconName: IconName) => {
    setSelectedIcon(iconName);
    const IconComponent = iconComponents[iconName];
    
    if (IconComponent) {
      // Correctly render the icon to a temporary div to get its SVG string
      try {
        const tempDiv = document.createElement('div');
        const root = ReactDOM.createRoot(tempDiv);
        root.render(React.createElement(IconComponent, { size: 24 }));
        
        // Use queueMicrotask to read innerHTML after render cycle completes
        queueMicrotask(() => {
          const svgString = tempDiv.innerHTML;
          
          if (svgString && svgString.startsWith('<svg')) {
            onChange(svgString);
          } else {
            console.error('Failed to capture SVG string from rendered icon (in microtask).');
            onChange('<svg></svg>');
          }
          // Optional: Clean up the root after capturing
          // root.unmount();
        });

      } catch (error) { 
        console.error('Error rendering icon to string:', error);
        onChange('<svg></svg>');
      }
    }
    
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected icon display */}
      <div 
        className="flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedIcon ? (
            <>
              {React.createElement(iconComponents[selectedIcon as IconName], { className: 'mr-2 text-xl' })}
              <span>{selectedIcon}</span>
            </>
          ) : value ? (
            <>
              <div className="mr-2 text-xl" dangerouslySetInnerHTML={{ __html: value }}></div>
              <span>Custom Icon</span>
            </>
          ) : (
            <span>Select an icon</span>
          )}
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          {/* Search and filters */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-2 py-1 text-xs rounded-full ${
                  !selectedCategory 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {Object.keys(iconsByCategory).map(category => (
                <button
                  key={category}
                  className={`px-2 py-1 text-xs rounded-full ${
                    selectedCategory === category 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Icons grid */}
          <div className="grid grid-cols-4 gap-2 p-2">
            {filteredIcons.map(icon => (
              <div
                key={icon.name}
                className={`p-3 flex flex-col items-center justify-center rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedIcon === icon.name ? 'bg-primary/10 border border-primary dark:bg-primary/20' : ''
                }`}
                onClick={() => handleSelectIcon(icon.name)}
              >
                {React.createElement(iconComponents[icon.name], { className: 'text-2xl mb-1' })}
                <span className="text-xs text-center truncate w-full">{icon.name.replace(/^(Fa|Ai|Bi)/, '')}</span>
              </div>
            ))}
            
            {filteredIcons.length === 0 && (
              <div className="col-span-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No icons found matching your search
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 