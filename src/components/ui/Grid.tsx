import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define grid variants
const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
        12: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12",
      },
      gap: {
        none: "gap-0",
        xs: "gap-1 sm:gap-2",
        sm: "gap-2 sm:gap-4",
        md: "gap-4 sm:gap-6",
        lg: "gap-6 sm:gap-8",
        xl: "gap-8 sm:gap-10",
      },
      rowGap: {
        none: "row-gap-0",
        xs: "row-gap-1 sm:row-gap-2",
        sm: "row-gap-2 sm:row-gap-4",
        md: "row-gap-4 sm:row-gap-6",
        lg: "row-gap-6 sm:row-gap-8",
        xl: "row-gap-8 sm:row-gap-10",
      },
      colGap: {
        none: "col-gap-0",
        xs: "col-gap-1 sm:col-gap-2",
        sm: "col-gap-2 sm:col-gap-4",
        md: "col-gap-4 sm:col-gap-6",
        lg: "col-gap-6 sm:col-gap-8",
        xl: "col-gap-8 sm:col-gap-10",
      },
    },
    defaultVariants: {
      cols: 3,
      gap: "md",
    },
  }
);

interface GridProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  children: ReactNode;
}

export function Grid({ 
  children, 
  className, 
  cols, 
  gap, 
  rowGap,
  colGap,
  ...props 
}: GridProps) {
  return (
    <div 
      className={gridVariants({ cols, gap, rowGap, colGap, className })} 
      {...props}
    >
      {children}
    </div>
  );
}

export { gridVariants }; 