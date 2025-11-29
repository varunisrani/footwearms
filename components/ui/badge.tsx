import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  outline?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  outline = false,
  className
}: BadgeProps) {
  const baseStyles = cn(
    'inline-flex items-center font-medium rounded-full transition-all duration-200',
    outline ? 'bg-transparent border-2' : ''
  );

  const solidVariants = {
    default: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-600',
    success: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800',
  };

  const outlineVariants = {
    default: 'border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-300',
    success: 'border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400',
    warning: 'border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400',
    danger: 'border-red-400 dark:border-red-600 text-red-700 dark:text-red-400',
    info: 'border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-400',
    purple: 'border-purple-400 dark:border-purple-600 text-purple-700 dark:text-purple-400',
    pink: 'border-pink-400 dark:border-pink-600 text-pink-700 dark:text-pink-400',
  };

  const dotColors = {
    default: 'bg-gray-500 dark:bg-gray-400',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-red-500 dark:bg-red-400',
    info: 'bg-blue-500 dark:bg-blue-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
    pink: 'bg-pink-500 dark:bg-pink-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        baseStyles,
        outline ? outlineVariants[variant] : solidVariants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            dotColors[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
}

// Status Badge with Icon
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'processing';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active', dot: true },
    inactive: { variant: 'default' as const, label: 'Inactive', dot: true },
    pending: { variant: 'warning' as const, label: 'Pending', dot: true, pulse: true },
    completed: { variant: 'success' as const, label: 'Completed', dot: true },
    cancelled: { variant: 'danger' as const, label: 'Cancelled', dot: true },
    processing: { variant: 'info' as const, label: 'Processing', dot: true, pulse: true },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      pulse={config.pulse}
      className={className}
    >
      {config.label}
    </Badge>
  );
}

// Count Badge (for notifications)
interface CountBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function CountBadge({ count, max = 99, className }: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5',
        'bg-red-500 text-white text-[10px] font-bold rounded-full',
        'animate-scaleIn',
        className
      )}
    >
      {displayCount}
    </span>
  );
}
