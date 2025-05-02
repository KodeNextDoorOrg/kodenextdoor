'use client';

import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

// Form Control - Wrapper for form elements
interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FormControl({ children, className, ...props }: FormControlProps) {
  return (
    <div className={`mb-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

// Form Label Component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export function FormLabel({ children, className, required, ...props }: FormLabelProps) {
  return (
    <label 
      className={`block text-sm font-medium text-white mb-2 ${className || ''}`} 
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

// Input component variants
const inputVariants = cva(
  "w-full border outline-none transition-colors shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-gray-800/50 border-gray-700/50 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-400",
        filled: "bg-gray-700 border-transparent focus:border-primary focus:bg-gray-800 text-white",
        outline: "bg-transparent border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary text-white",
        error: "bg-gray-800/50 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white",
      },
      size: {
        sm: "px-3 py-2 text-sm rounded-md",
        md: "px-4 py-3 rounded-lg",
        lg: "px-5 py-4 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Input component
interface InputProps 
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  withAnimation?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, withAnimation = false, ...props }, ref) => {
    // If there's an error, override the variant
    const inputVariant = error ? "error" : variant;
    
    // Animation properties
    const animationProps = withAnimation
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 }
        }
      : {};

    return (
      <>
        <motion.input
          ref={ref}
          className={inputVariants({ variant: inputVariant, size, className })}
          {...animationProps}
          {...props}
        />
        {error && (
          <motion.p 
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps 
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  withAnimation?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, error, withAnimation = false, ...props }, ref) => {
    // If there's an error, override the variant
    const textareaVariant = error ? "error" : variant;
    
    // Animation properties
    const animationProps = withAnimation
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 }
        }
      : {};

    return (
      <>
        <motion.textarea
          ref={ref}
          className={inputVariants({ variant: textareaVariant, size, className })}
          {...animationProps}
          {...props}
        />
        {error && (
          <motion.p 
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select component
interface SelectProps 
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof inputVariants> {
  children: ReactNode;
  error?: string;
  withAnimation?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, error, children, withAnimation = false, ...props }, ref) => {
    // If there's an error, override the variant
    const selectVariant = error ? "error" : variant;
    
    // Animation properties
    const animationProps = withAnimation
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 }
        }
      : {};

    return (
      <>
        <div className="relative">
          <motion.select
            ref={ref}
            className={inputVariants({ variant: selectVariant, size, className })}
            {...animationProps}
            {...props}
          >
            {children}
          </motion.select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {error && (
          <motion.p 
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </>
    );
  }
);

Select.displayName = 'Select'; 