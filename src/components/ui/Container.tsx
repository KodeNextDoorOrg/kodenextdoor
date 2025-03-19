import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const containerVariants = cva(
  "mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      size: {
        default: "max-w-7xl", // Standard container size
        sm: "max-w-3xl",      // Small container size
        md: "max-w-5xl",      // Medium container size
        lg: "max-w-7xl",      // Large container size
        xl: "max-w-[90rem]",  // Extra large container size
        full: "max-w-full",   // Full width container
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface ContainerProps extends VariantProps<typeof containerVariants> {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({ 
  children, 
  size, 
  className,
  id,
  ...props 
}: ContainerProps) {
  return (
    <div 
      className={containerVariants({ size, className })} 
      id={id}
      {...props}
    >
      {children}
    </div>
  );
}

export { containerVariants }; 