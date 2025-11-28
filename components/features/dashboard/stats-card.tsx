import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  iconBgColor?: string;
  helperText?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  helperText,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden border border-transparent bg-white/80 shadow-lg shadow-slate-200/70 backdrop-blur-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-blue-200',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="relative pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {title}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
            {trend && (
              <p
                className={`text-sm mt-2 ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </p>
            )}
          </div>
          <div
            className={cn(
              'rounded-2xl p-3 text-white transition-transform duration-300 group-hover:scale-110',
              iconBgColor
            )}
          >
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>
        {helperText && (
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-slate-500/80">
            {helperText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
