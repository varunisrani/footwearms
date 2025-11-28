import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  fullWidthOnMobile?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  isLoading,
  disabled,
  fullWidthOnMobile = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0';

  const variants = {
    primary: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500',
    secondary: 'bg-gray-800 text-white shadow-lg shadow-gray-900/30 hover:bg-gray-700',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-600/30 hover:bg-red-500',
    outline:
      'border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-blue-100/80',
    ghost: 'text-gray-800 hover:text-blue-600 hover:bg-blue-50',
    gradient:
      'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-blue-500/40 hover:shadow-blue-600/40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidthOnMobile && 'w-full md:w-auto',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
