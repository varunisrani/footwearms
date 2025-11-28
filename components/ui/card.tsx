import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-white/70 bg-white/80 text-slate-900 shadow-xl shadow-slate-900/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-slate-900/15 animate-fade-up',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'px-5 py-4 md:px-8 md:py-5 border-b border-white/70 bg-gradient-to-r from-white/60 to-white/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3
      className={cn('text-lg font-semibold text-slate-900 tracking-tight md:text-xl', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p className={cn('mt-1 text-sm text-slate-500', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn('px-5 py-4 md:px-8 md:py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'px-5 py-4 md:px-8 md:py-5 border-t border-white/70 bg-white/70 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
