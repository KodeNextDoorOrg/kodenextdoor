'use client';

import { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

// Define text variants
const textVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "text-gray-300",
        muted: "text-gray-400",
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        light: "text-text-light",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg sm:text-xl",
        xl: "text-xl sm:text-2xl",
        "2xl": "text-2xl sm:text-3xl",
      },
      weight: {
        thin: "font-thin",
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },
      leading: {
        none: "leading-none",
        tight: "leading-tight",
        snug: "leading-snug",
        normal: "leading-normal",
        relaxed: "leading-relaxed",
        loose: "leading-loose",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "base",
      weight: "normal",
      align: "left",
      leading: "normal",
    },
  }
);

interface TextProps 
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div';
  withAnimation?: boolean;
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ 
    children, 
    className, 
    variant, 
    size, 
    weight, 
    align, 
    leading, 
    as = 'p',
    withAnimation = false,
    ...props 
  }, ref) => {
    const Component = as === 'p' ? motion.p : (as === 'span' ? motion.span : motion.div);
    
    // Track if component is mounted (client-side) to prevent hydration mismatch
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
      setIsClient(true);
    }, []);
    
    // Animation properties - only apply on client-side
    const animationProps = withAnimation && isClient
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 }
        } 
      : {};

    return (
      <Component
        ref={ref}
        className={textVariants({ variant, size, weight, align, leading, className })}
        {...animationProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants }; 