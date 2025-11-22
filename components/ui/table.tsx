import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-gray-200', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-gray-50', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('bg-white divide-y divide-gray-200', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-gray-50 transition-colors', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
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
    <td className={cn('px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900', className)} {...props}>
      {children}
    </td>
  );
}
