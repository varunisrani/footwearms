import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'gradient' | 'glass' | 'bordered';
  hover?: boolean;
  animate?: boolean;
}

export function Card({
  children,
  className,
  variant = 'default',
  hover = true,
  animate = false,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm',
    elevated: 'bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900/50 border-0',
    gradient: 'bg-white dark:bg-slate-800 border-0 overflow-hidden card-gradient',
    glass: 'glass',
    bordered: 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 shadow-none',
  };

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variants[variant],
        hover && 'hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-1',
        animate && 'animate-fadeIn',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'px-5 py-4 md:px-6 md:py-5 border-b border-gray-100 dark:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p
      className={cn(
        'text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'px-5 py-4 md:px-6 md:py-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'px-5 py-4 md:px-6 md:py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 rounded-b-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// New Stat Card Wrapper for dashboard statistics
export function StatCard({
  children,
  className,
  color = 'blue',
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' }) {
  const colors = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-100 dark:border-blue-900/50 dark:from-blue-500/20 dark:to-blue-600/10',
    green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-100 dark:border-emerald-900/50 dark:from-emerald-500/20 dark:to-emerald-600/10',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-100 dark:border-purple-900/50 dark:from-purple-500/20 dark:to-purple-600/10',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-100 dark:border-orange-900/50 dark:from-orange-500/20 dark:to-orange-600/10',
    red: 'from-red-500/10 to-red-600/5 border-red-100 dark:border-red-900/50 dark:from-red-500/20 dark:to-red-600/10',
    cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-100 dark:border-cyan-900/50 dark:from-cyan-500/20 dark:to-cyan-600/10',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all duration-200',
        'hover:shadow-lg dark:hover:shadow-slate-900/50 hover:-translate-y-0.5',
        colors[color],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
