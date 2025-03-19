'use client';

import { createElement, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

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

interface HeadingProps 
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  withAnimation?: boolean;
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
    ...props 
  }, ref) => {
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
          backgroundSize: ["100%", "200%", "100%"],
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        },
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      };

      return createElement(
        motion[Tag] as any,
        {
          ref,
          className: headingVariants({ level, variant, align, responsive, className }),
          initial: withAnimation ? animations.initial : undefined,
          animate: withAnimation 
            ? { ...animations.animate, ...gradientAnimation.animate } 
            : gradientAnimation.animate,
          transition: withAnimation 
            ? animations.transition 
            : gradientAnimation.transition,
          ...props
        },
        children
      );
    }

    return createElement(
      motion[Tag] as any,
      {
        ref,
        className: headingVariants({ level, variant, align, responsive, className }),
        initial: withAnimation ? animations.initial : undefined,
        animate: withAnimation ? animations.animate : undefined,
        transition: withAnimation ? animations.transition : undefined,
        ...props
      },
      children
    );
  }
);

Heading.displayName = 'Heading';

export { Heading, headingVariants }; 