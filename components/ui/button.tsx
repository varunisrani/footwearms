import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  isLoading?: boolean;
  fullWidthOnMobile?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  shine?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  isLoading,
  disabled,
  fullWidthOnMobile = false,
  leftIcon,
  rightIcon,
  shine = false,
  ...props
}, ref) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium',
    'rounded-lg transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'active:scale-[0.98]'
  );

  const variants = {
    primary: cn(
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      'hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25',
      'focus-visible:ring-blue-500'
    ),
    secondary: cn(
      'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
      'hover:from-gray-700 hover:to-gray-800 hover:shadow-lg hover:shadow-gray-500/25',
      'focus-visible:ring-gray-500'
    ),
    success: cn(
      'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
      'hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25',
      'focus-visible:ring-emerald-500'
    ),
    danger: cn(
      'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25',
      'focus-visible:ring-red-500'
    ),
    outline: cn(
      'border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 bg-transparent',
      'hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:shadow-md',
      'focus-visible:ring-gray-400 dark:focus-visible:ring-slate-500'
    ),
    ghost: cn(
      'text-gray-700 dark:text-gray-200 bg-transparent',
      'hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100',
      'focus-visible:ring-gray-400 dark:focus-visible:ring-slate-500'
    ),
    gradient: cn(
      'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white',
      'hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
      'hover:shadow-lg hover:shadow-purple-500/25',
      'focus-visible:ring-purple-500',
      'animate-gradient bg-[length:200%_200%]'
    ),
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
    xl: 'px-6 py-3 text-lg gap-2.5',
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidthOnMobile && 'w-full md:w-auto',
        shine && 'btn-shine',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
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
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';

// Icon Button Component
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  isLoading,
  disabled,
  ...props
}, ref) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center',
    'rounded-lg transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95'
  );

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    outline: 'border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 focus-visible:ring-gray-400 dark:focus-visible:ring-slate-500',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 focus-visible:ring-gray-400 dark:focus-visible:ring-slate-500',
  };

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
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
      ) : (
        children
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';
