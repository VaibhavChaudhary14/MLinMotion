import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'vermilion' | 'ultramarine' | 'amber' | 'sage' | 'neutral' | 'dark';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
  size = 'md',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'vermilion':
        return 'bg-[#C83226]/10 text-[#C83226] border-[#C83226]';
      case 'ultramarine':
        return 'bg-[#1848B8]/10 text-[#1848B8] border-[#1848B8]';
      case 'amber':
        return 'bg-[#E28C05]/15 text-[#9A5C00] border-[#E28C05]';
      case 'sage':
        return 'bg-[#33634B]/10 text-[#33634B] border-[#33634B]';
      case 'dark':
        return 'bg-[#1A1715] text-[#FAF7F0] border-[#1A1715]';
      case 'neutral':
      default:
        return 'bg-[#E8E1D3] text-[#5C544B] border-[#1A1715]';
    }
  };

  return (
    <span
      className={cn(
        'font-mono uppercase font-bold tracking-wider inline-flex items-center gap-1 border-[1px] select-none rounded-[1px]',
        size === 'sm' ? 'text-[9px] px-1.5 py-0.2' : 'text-[11px] px-2 py-0.5',
        getStyles(),
        className
      )}
    >
      {children}
    </span>
  );
};
