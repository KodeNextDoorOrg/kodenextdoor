'use client';

import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

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

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  whileInView?: any;
  initial?: any;
  animate?: any;
}

export function Card({
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
  ...props
}: CardProps) {
  return (
    <motion.div
      className={cardVariants({ variant, padding, radius, animation, className })}
      onClick={onClick}
      whileInView={whileInView}
      initial={initial}
      animate={animate}
      {...props}
    >
      {children}
    </motion.div>
  );
}

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

Card.Image = function CardImage({
  className,
  src,
  alt = "",
  ...props
}: {
  className?: string;
  src: string;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full object-cover ${className}`}
      {...props}
    />
  );
};

export { cardVariants }; 