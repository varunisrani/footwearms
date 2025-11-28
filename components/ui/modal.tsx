'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-[95vw] sm:max-w-md',
    md: 'max-w-[95vw] sm:max-w-lg',
    lg: 'max-w-[95vw] sm:max-w-2xl',
    xl: 'max-w-[95vw] sm:max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-white/70 bg-white/90 shadow-2xl shadow-slate-900/30 backdrop-blur-md animate-fade-up',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-white/70 bg-gradient-to-r from-white/70 to-white/40 px-4 py-3 md:px-6 md:py-4">
              {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-xl border border-transparent p-1.5 text-slate-400 transition hover:border-slate-200 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-4 py-3 md:px-6 md:py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-white/70 bg-white/70 px-4 py-3 backdrop-blur-sm md:px-6 md:py-4',
        className
      )}
    >
      {children}
    </div>
  );
}
