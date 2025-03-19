import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define flex variants
const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        rowReverse: "flex-row-reverse",
        col: "flex-col",
        colReverse: "flex-col-reverse",
        rowToCol: "flex-row sm:flex-col",
        colToRow: "flex-col sm:flex-row",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      wrap: {
        wrap: "flex-wrap",
        nowrap: "flex-nowrap",
        wrapReverse: "flex-wrap-reverse",
      },
      gap: {
        none: "gap-0",
        xs: "gap-1 sm:gap-2",
        sm: "gap-2 sm:gap-4",
        md: "gap-4 sm:gap-6",
        lg: "gap-6 sm:gap-8",
        xl: "gap-8 sm:gap-10",
      },
    },
    defaultVariants: {
      direction: "row",
      align: "start",
      justify: "start",
      wrap: "nowrap",
      gap: "md",
    },
  }
);

interface FlexProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  children: ReactNode;
}

export function Flex({ 
  children, 
  className, 
  direction, 
  align, 
  justify, 
  wrap, 
  gap, 
  ...props 
}: FlexProps) {
  return (
    <div 
      className={flexVariants({ direction, align, justify, wrap, gap, className })} 
      {...props}
    >
      {children}
    </div>
  );
}

export { flexVariants }; 