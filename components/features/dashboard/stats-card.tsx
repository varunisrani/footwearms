import { Card, CardContent } from '@/components/ui/card';
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
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-100/30 via-white/0 to-purple-100/40" />
      <CardContent className="relative z-10 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <span
                className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                <span className="mr-1 text-base">{trend.isPositive ? '↗' : '↘'}</span>
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
          <div className={`rounded-2xl p-3 shadow-inner shadow-black/20 ${iconBgColor}`}>
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
