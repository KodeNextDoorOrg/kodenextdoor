'use client';

import React, { useState, useEffect, useRef } from 'react';
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

// Convert React icon to SVG string
const iconToSvgString = (Icon: React.FC<React.SVGProps<SVGSVGElement>>): string => {
  // Create a temporary div to render the icon
  const tempDiv = document.createElement('div');
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
  // Set attributes (these match what react-icons uses)
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('fill', 'currentColor');
  icon.setAttribute('stroke-width', '0');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('height', '24');
  icon.setAttribute('width', '24');
  
  // Get the path data from the icon component
  const iconElement = document.createElement('div');
  iconElement.innerHTML = Icon({ height: '24', width: '24' } as any).props.children.props.children;
  
  // Clone the path nodes into our SVG
  Array.from(iconElement.querySelectorAll('path')).forEach(path => {
    icon.appendChild(path.cloneNode(true));
  });
  
  // Add to temp div and get the outerHTML
  tempDiv.appendChild(icon);
  return tempDiv.innerHTML;
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
    .flatMap(([_, icons]) => 
      icons.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
  // Handle icon selection
  const handleSelectIcon = (iconName: IconName) => {
    setSelectedIcon(iconName);
    const IconComponent = iconComponents[iconName];
    
    if (IconComponent) {
      // Convert React component to SVG string and pass it back
      try {
        const iconElement = React.createElement(IconComponent, { size: 24 });
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = ReactDOMServer.renderToStaticMarkup(iconElement);
        onChange(tempDiv.innerHTML);
      } catch (error) {
        console.error('Error converting icon to string:', error);
        // Fallback method for browsers
        const iconString = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="${getIconPath(iconName)}"></path></svg>`;
        onChange(iconString);
      }
    }
    
    setIsOpen(false);
  };
  
  // Helper to get icon path data (fallback method)
  const getIconPath = (iconName: IconName): string => {
    // This is a simplified fallback that would need actual path data
    // In a real implementation, you'd need to extract the actual SVG path data
    return '';
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

// Fallback implementation of ReactDOMServer for client-side only
const ReactDOMServer = {
  renderToStaticMarkup: (element: React.ReactElement): string => {
    try {
      // Try to use a simple approach to extract SVG content
      const IconComponent = element.type;
      const props = { ...element.props, size: 24 };
      const tempDiv = document.createElement('div');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('stroke-width', '0');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('height', '24');
      svg.setAttribute('width', '24');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      tempDiv.appendChild(svg);
      return tempDiv.innerHTML;
    } catch (e) {
      console.error('Error in renderToStaticMarkup:', e);
      return '<svg></svg>';
    }
  }
}; 