'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20 hover:shadow-amber-900/30',
        destructive:
          'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20',
        outline:
          'border-2 border-amber-600/50 bg-transparent text-amber-100 hover:bg-amber-600/10 hover:border-amber-500',
        secondary:
          'bg-stone-700 text-stone-100 hover:bg-stone-600 shadow-lg shadow-stone-900/20',
        ghost:
          'text-stone-300 hover:bg-stone-800 hover:text-stone-100',
        link:
          'text-amber-500 underline-offset-4 hover:underline hover:text-amber-400',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      // When asChild is true, clone the child and merge className
      const childProps = (children as React.ReactElement).props as { className?: string };
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(buttonClasses, childProps?.className),
        ...props,
      } as any);
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };


