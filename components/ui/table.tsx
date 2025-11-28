import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-white/70 bg-white/80 shadow-lg shadow-slate-900/5">
      <table className={cn('min-w-full divide-y divide-slate-100 text-slate-700', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-gradient-to-r from-white/70 to-white/40 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-slate-100 bg-white/60 backdrop-blur-sm', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('transition-all duration-200 hover:bg-blue-50/60', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-3 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-500 md:px-6',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'whitespace-nowrap px-3 py-3 text-xs text-slate-900 md:px-6 md:py-4 md:text-sm',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
