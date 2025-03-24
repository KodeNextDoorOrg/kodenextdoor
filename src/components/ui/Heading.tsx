'use client';

import { createElement, forwardRef, useState, useEffect } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import React from 'react';

// Define heading variants
const headingVariants = cva(
  "font-bold", 
  {
    variants: {
      level: {
        h1: "text-4xl sm:text-5xl md:text-6xl leading-tight",
        h2: "text-3xl sm:text-4xl md:text-5xl leading-tight",
        h3: "text-2xl sm:text-3xl md:text-4xl leading-tight",
        h4: "text-xl sm:text-2xl md:text-3xl leading-tight",
        h5: "text-lg sm:text-xl md:text-2xl leading-tight",
        h6: "text-base sm:text-lg md:text-xl leading-tight",
      },
      variant: {
        default: "text-gray-800 dark:text-white",
        primary: "text-primary",
        secondary: "text-secondary",
        gradient: "text-gradient",
        muted: "text-gray-600 dark:text-gray-300",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      responsive: {
        true: "max-w-full break-words",
      },
    },
    defaultVariants: {
      level: "h2",
      variant: "default",
      align: "left",
      responsive: true,
    },
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  withAnimation?: boolean;
  withGradient?: boolean;
  animationDelay?: number;
  motionProps?: MotionProps;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ 
    children, 
    className, 
    level = 'h2', 
    variant, 
    align, 
    responsive,
    as,
    withAnimation = false,
    withGradient = false,
    animationDelay = 0,
    motionProps,
    ...props 
  }, ref) => {
    // Track if we're on client-side to prevent hydration issues
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
      setIsClient(true);
      
      // Force immediate animation start with a small delay
      const timer = setTimeout(() => {
        // This will trigger a re-render and apply animations
        setIsClient(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }, []);
    
    // Default animations for headings
    const animations = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    };

    // Use the level as the element tag if 'as' is not provided
    const Tag = as || level;

    // Handle gradient text specially
    if (variant === 'gradient') {
      const gradientAnimation = {
        animate: { 
          backgroundSize: ["100%", "200%"],
          backgroundPosition: ["0% 0%", "100% 100%"]
        },
        transition: { 
          duration: 5, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut" 
        }
      };

      return createElement(
        motion[Tag] as any,
        {
          ref,
          className: headingVariants({ level, variant, align, responsive, className }),
          initial: withAnimation && isClient ? animations.initial : undefined,
          animate: withAnimation && isClient
            ? { ...animations.animate, ...gradientAnimation.animate } 
            : isClient ? gradientAnimation.animate : undefined,
          transition: withAnimation
            ? animations.transition 
            : gradientAnimation.transition,
          ...props,
          ...motionProps
        },
        children
      );
    }

    return createElement(
      motion[Tag] as any,
      {
        ref,
        className: headingVariants({ level, variant, align, responsive, className }),
        initial: withAnimation && isClient ? animations.initial : undefined,
        animate: withAnimation && isClient ? animations.animate : undefined,
        transition: withAnimation ? animations.transition : undefined,
        ...props,
        ...motionProps
      },
      children
    );
  }
);

Heading.displayName = 'Heading';

export { Heading, headingVariants }; 