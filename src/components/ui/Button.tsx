'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:opacity-90 shadow-md",
        secondary: "bg-secondary text-white hover:opacity-90 shadow-md",
        outline: "border border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-primary hover:bg-primary/10",
        gradient: "bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90 shadow-md",
      },
      size: {
        sm: "text-sm px-4 py-2",
        md: "text-base px-6 py-2.5",
        lg: "text-lg px-8 py-3",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  withEffect?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, withEffect = true, href, children, ...props }, ref) => {
    // Animation for the button background effect
    const effectVariants = {
      initial: { x: '-100%' },
      hover: { x: 0 },
    };

    const button = (
      <motion.button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        whileHover={withEffect ? { scale: 1.03 } : undefined}
        whileTap={withEffect ? { scale: 0.97 } : undefined}
        {...props}
      >
        {variant === 'primary' && withEffect && (
          <motion.span 
            className="absolute inset-0 bg-primary-dark"
            initial="initial"
            animate="initial"
            whileHover="hover"
            variants={effectVariants}
            transition={{ duration: 0.3 }}
          />
        )}

        {variant === 'gradient' && withEffect && (
          <motion.span 
            className="absolute inset-0 bg-primary-dark"
            initial="initial"
            animate="initial"
            whileHover="hover"
            variants={effectVariants}
            transition={{ duration: 0.3 }}
          />
        )}

        <span className="relative z-10">{children}</span>
      </motion.button>
    );

    // If href is provided, wrap button in Link component
    return href ? (
      <Link href={href}>
        {button}
      </Link>
    ) : (
      button
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; 