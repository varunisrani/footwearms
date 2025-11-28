import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
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
    'inline-flex items-center justify-center rounded-2xl font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-0 hover:-translate-y-0.5';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-indigo-600/40 focus-visible:ring-blue-500',
    secondary:
      'bg-white/80 text-slate-800 border border-slate-200 shadow-md hover:bg-white focus-visible:ring-slate-500',
    danger:
      'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30 focus-visible:ring-rose-500',
    outline:
      'border border-slate-200 text-slate-800 bg-transparent hover:bg-white/70 focus-visible:ring-blue-400',
    ghost: 'text-slate-600 hover:bg-slate-100/70 focus-visible:ring-slate-400',
  } as const;

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  } as const;

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
      aria-busy={isLoading ? 'true' : 'false'}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin text-current"
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
