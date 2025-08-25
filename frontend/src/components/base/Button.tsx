import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variants = {
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'outline', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);


interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: LucideIcon;
  children: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        <Icon className="w-4 h-4" />
        {children}
      </Button>
    );
  }
);


export default Button;
export { IconButton };
