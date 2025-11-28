import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const variants = {
    info: {
      container: 'border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 text-blue-900',
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    success: {
      container: 'border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-emerald-100/80 text-emerald-900',
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    },
    warning: {
      container: 'border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 text-amber-900',
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    },
    error: {
      container: 'border-rose-200/60 bg-gradient-to-r from-rose-50/80 to-rose-100/80 text-rose-900',
      icon: <XCircle className="h-5 w-5 text-rose-500" />,
    },
  };

  const { container, icon } = variants[variant];

  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border px-4 py-3 text-sm shadow-md shadow-black/5 backdrop-blur-sm',
        container,
        className
      )}
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/70 shadow">{icon}</div>
      <div className="flex-1">
        {title && <h4 className="mb-1 font-semibold tracking-tight">{title}</h4>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
