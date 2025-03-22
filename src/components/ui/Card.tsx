'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Define more specific types to replace 'any'
type HTMLElementProps = React.HTMLAttributes<HTMLElement>;
type ElementType = React.ElementType;
type LinkProps = {
  href: string;
  target?: string;
  rel?: string;
};

// Define card variants using class-variance-authority
const cardVariants = cva(
  "rounded-xl overflow-hidden border backdrop-blur-sm transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 border-white/20 dark:border-gray-700/30 shadow-lg",
        subtle: "bg-white/50 dark:bg-gray-800/50 border-white/10 dark:border-gray-700/20 shadow-md",
        accent: "bg-gradient-to-br from-primary/20 to-secondary/20 border-white/20 dark:border-gray-700/30 shadow-lg",
        elevated: "bg-white dark:bg-gray-800 border-white/30 dark:border-gray-700/30 shadow-xl",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-5",
        lg: "p-8",
      },
      radius: {
        default: "rounded-xl",
        lg: "rounded-2xl",
        full: "rounded-full",
      },
      animation: {
        none: "",
        hover: "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      radius: "default",
      animation: "none",
    },
  }
);

// Define interfaces for the Card components
interface CardProps extends HTMLElementProps, VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  whileInView?: any;
  initial?: any;
  animate?: any;
  as?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant,
  padding,
  radius,
  animation,
  className,
  onClick,
  whileInView,
  initial,
  animate,
  as: Component = 'div',
  href,
  target,
  rel,
  ...props
}, ref) => {
  const Comp = href ? 'a' : Component;
  const linkProps: LinkProps | {} = href 
    ? { href, target: target || '_blank', rel: rel || 'noopener noreferrer' } 
    : {};

  return (
    <motion.div
      ref={ref}
      className={cn(cardVariants({ variant, padding, radius, animation, className }))}
      onClick={onClick}
      whileInView={whileInView}
      initial={initial}
      animate={animate}
      {...linkProps}
      {...props}
    >
      {children}
    </motion.div>
  );
});
Card.displayName = 'Card';

// Card components for flexibility
Card.Header = function CardHeader({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={`text-xl font-bold text-gray-800 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={`text-gray-600 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </p>
  );
};

Card.Footer = function CardFooter({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mt-4 pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardMediaProps extends HTMLElementProps {
  image: string;
  alt: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '2:1';
  fill?: boolean;
  height?: number;
  width?: number;
}

const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(({
  className,
  image,
  alt,
  aspectRatio = '16:9',
  fill = false,
  height,
  width,
  ...props
}, ref) => {
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-[16/9]',
    '2:1': 'aspect-[2/1]',
  };
  
  return (
    <div 
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-700",
        !fill && aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <Image
        src={image}
        alt={alt}
        fill={fill}
        width={!fill ? width || 1200 : undefined}
        height={!fill ? height || 800 : undefined}
        className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-105"
      />
    </div>
  );
});
CardMedia.displayName = 'CardMedia';

export { cardVariants }; 