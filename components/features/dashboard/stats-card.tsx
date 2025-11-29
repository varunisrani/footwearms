'use client';

import { LucideIcon, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'pink' | 'indigo';
  href?: string;
  // Legacy props for backward compatibility
  iconColor?: string;
  iconBgColor?: string;
}

const colorVariants = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-800',
    shadow: 'shadow-blue-500/10',
    glow: 'bg-blue-500/10 dark:bg-blue-500/20',
  },
  green: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-800',
    shadow: 'shadow-emerald-500/10',
    glow: 'bg-emerald-500/10 dark:bg-emerald-500/20',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-800',
    shadow: 'shadow-purple-500/10',
    glow: 'bg-purple-500/10 dark:bg-purple-500/20',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-800',
    shadow: 'shadow-orange-500/10',
    glow: 'bg-orange-500/10 dark:bg-orange-500/20',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-100 dark:border-red-800',
    shadow: 'shadow-red-500/10',
    glow: 'bg-red-500/10 dark:bg-red-500/20',
  },
  cyan: {
    gradient: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-900/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-100 dark:border-cyan-800',
    shadow: 'shadow-cyan-500/10',
    glow: 'bg-cyan-500/10 dark:bg-cyan-500/20',
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50 dark:bg-pink-900/30',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-100 dark:border-pink-800',
    shadow: 'shadow-pink-500/10',
    glow: 'bg-pink-500/10 dark:bg-pink-500/20',
  },
  indigo: {
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-800',
    shadow: 'shadow-indigo-500/10',
    glow: 'bg-indigo-500/10 dark:bg-indigo-500/20',
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'blue',
  href,
}: StatsCardProps) {
  const colors = colorVariants[color];

  const CardWrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-5 md:p-6',
        'border border-gray-100 dark:border-slate-700 shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-1',
        href && 'cursor-pointer'
      )}
    >
      {/* Background Glow Effect */}
      <div className={cn(
        'absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-50 blur-3xl transition-opacity duration-300',
        colors.glow,
        'group-hover:opacity-80'
      )} />

      <div className="relative flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide">
            {title}
          </p>

          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight stats-number">
              {value}
            </p>
            {trend && (
              <span className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                trend.isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend.value}%
              </span>
            )}
          </div>

          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              {description}
            </p>
          )}

          {href && (
            <div className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              <span>View details</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="relative">
          <div className={cn(
            'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl',
            'bg-gradient-to-br shadow-lg transition-all duration-300',
            colors.gradient,
            colors.shadow,
            'group-hover:scale-110 group-hover:shadow-xl'
          )}>
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>

          {/* Subtle ring on hover */}
          <div className={cn(
            'absolute inset-0 rounded-2xl ring-0 transition-all duration-300',
            'group-hover:ring-4 group-hover:ring-offset-2 dark:group-hover:ring-offset-slate-800',
            colors.glow.replace('bg-', 'ring-')
          )} />
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-r',
        colors.gradient
      )} />
    </CardWrapper>
  );
}

// Mini Stats Card for compact displays
interface MiniStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
}

export function MiniStatsCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
}: MiniStatsCardProps) {
  const colors = colorVariants[color];

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl',
      'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700',
      'transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-900/50'
    )}>
      <div className={cn(
        'flex items-center justify-center w-10 h-10 rounded-lg',
        colors.bg
      )}>
        <Icon className={cn('w-5 h-5', colors.text)} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}
