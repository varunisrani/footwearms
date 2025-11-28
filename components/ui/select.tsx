import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2.5 text-sm text-slate-900 shadow-inner shadow-slate-200/60 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'hover:border-blue-200',
            props.disabled && 'bg-slate-100/70 cursor-not-allowed text-slate-400',
            className
          )}
          {...props}
        >
          <option value="">Select an option...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
