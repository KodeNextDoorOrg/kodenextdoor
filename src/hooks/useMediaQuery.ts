'use client';

import { useState, useEffect } from 'react';

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Initialize with the current media query match
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Create a listener function to update state when media query changes
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Add listener for changes
    media.addEventListener('change', listener);
    
    // Clean up listener on unmount
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);
  
  return matches;
} 