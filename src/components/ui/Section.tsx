'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Container } from './Container';

const sectionVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      spacing: {
        default: "py-16 md:py-20", // Standard padding
        sm: "py-8 md:py-12",       // Small padding
        lg: "py-20 md:py-28",      // Large padding
        xl: "py-24 md:py-32",      // Extra large padding
        none: "",                  // No padding
      },
      variant: {
        default: "bg-transparent",
        light: "bg-gray-light dark:bg-gray-dark",
        dark: "bg-gray-dark dark:bg-gray-light text-white dark:text-gray-800",
        primary: "bg-primary/10",
        secondary: "bg-secondary/10",
        gradient: "bg-gradient-to-b from-background to-gray-light dark:from-background dark:to-gray-dark",
      },
    },
    defaultVariants: {
      spacing: "default",
      variant: "default",
    },
  }
);

interface SectionProps 
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
  as?: React.ElementType;
  withContainer?: boolean;
  containerSize?: "default" | "sm" | "md" | "lg" | "xl" | "full";
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ 
    children, 
    className, 
    spacing, 
    variant, 
    as: Component = 'section', 
    withContainer = true,
    containerSize = "default",
    ...props 
  }, ref) => {
    const content = withContainer ? (
      <Container size={containerSize}>{children}</Container>
    ) : (
      children
    );

    return (
      <motion.section
        ref={ref}
        className={sectionVariants({ spacing, variant, className })}
        {...props}
      >
        {content}
      </motion.section>
    );
  }
);

Section.displayName = 'Section';

export { Section, sectionVariants }; 