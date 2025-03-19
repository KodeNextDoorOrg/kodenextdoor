'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export default function useIntersectionObserver<T extends Element>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const { root = null, rootMargin = '0px', threshold = 0, once = false } = options;
  
  const elementRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        // If the once option is true and the element is intersecting,
        // disconnect the observer
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );
    
    observer.observe(element);
    
    // Clean up observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, once]);
  
  return [elementRef, isIntersecting];
} 