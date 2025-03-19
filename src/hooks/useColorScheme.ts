'use client';

import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

export default function useColorScheme(defaultScheme: ColorScheme = 'light'): [
  ColorScheme,
  (scheme: ColorScheme) => void
] {
  // Initialize state with defaultScheme
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultScheme);
  
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    // First check localStorage for a saved preference
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme | null;
    
    if (savedScheme && (savedScheme === 'light' || savedScheme === 'dark')) {
      setColorScheme(savedScheme);
    } else {
      // If no saved preference, check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorScheme(systemPrefersDark ? 'dark' : 'light');
      
      // Add listener for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setColorScheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [defaultScheme]);
  
  // Function to update the color scheme and save to localStorage
  const updateColorScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    
    // Update document classes or data attributes
    if (scheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Apply the current scheme to the document
  useEffect(() => {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorScheme]);
  
  return [colorScheme, updateColorScheme];
} 