import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800',
    warning: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800',
    danger: 'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-50 text-blue-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm shadow-black/5',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
