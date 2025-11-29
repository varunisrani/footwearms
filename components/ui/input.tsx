import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'filled' | 'ghost';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, success, leftIcon, rightIcon, variant = 'default', className, ...props }, ref) => {
    const variants = {
      default: cn(
        'border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800',
        'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20',
        'hover:border-gray-300 dark:hover:border-slate-500'
      ),
      filled: cn(
        'border-0 bg-gray-100 dark:bg-slate-700',
        'focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20',
        'hover:bg-gray-50 dark:hover:bg-slate-600'
      ),
      ghost: cn(
        'border-0 bg-transparent',
        'focus:bg-gray-50 dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20',
        'hover:bg-gray-50 dark:hover:bg-slate-800'
      ),
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {props.required && (
              <span className="text-red-500 text-xs">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl shadow-sm transition-all duration-200',
              'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
              'focus:outline-none',
              leftIcon ? 'pl-10' : 'px-4',
              rightIcon || error || success ? 'pr-10' : 'px-4',
              'py-2.5 text-sm',
              variants[variant],
              error && 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20',
              success && 'border-emerald-300 dark:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20',
              props.disabled && 'bg-gray-100 dark:bg-slate-700 cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {error && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {success && !error && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            {rightIcon && !error && !success && (
              <span className="text-gray-400 dark:text-gray-500">{rightIcon}</span>
            )}
          </div>
        </div>

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <p className={cn(
            'text-xs leading-relaxed transition-colors',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input variant
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder="Search..."
        leftIcon={
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        className={cn('pr-4', className)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {props.required && (
              <span className="text-red-500 text-xs">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl',
            'border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm',
            'text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20',
            'hover:border-gray-300 dark:hover:border-slate-500 transition-all duration-200',
            'resize-none',
            error && 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20',
            props.disabled && 'bg-gray-100 dark:bg-slate-700 cursor-not-allowed opacity-60',
            className
          )}
          rows={4}
          {...props}
        />

        {(error || helperText) && (
          <p className={cn(
            'text-xs leading-relaxed',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
