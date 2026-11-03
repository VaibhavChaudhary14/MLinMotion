import React from 'react';
import { cn } from '@/lib/utils';

interface AnalogButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ultramarine' | 'amber' | 'sage' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const AnalogButton: React.FC<AnalogButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  disabled,
  isLoading,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#C83226] text-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none hover:bg-[#b0291f]';
      case 'ultramarine':
        return 'bg-[#1848B8] text-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none hover:bg-[#133aa0]';
      case 'amber':
        return 'bg-[#E28C05] text-[#1A1715] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none hover:bg-[#c97c03]';
      case 'sage':
        return 'bg-[#33634B] text-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none hover:bg-[#28503c]';
      case 'ghost':
        return 'bg-transparent text-[#1A1715] border-[1.5px] border-transparent hover:border-[#1A1715] hover:bg-[#E8E1D3]/50';
      case 'secondary':
      default:
        return 'bg-[#FAF7F0] text-[#1A1715] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none hover:bg-[#F0EAE0]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1 text-xs';
      case 'lg':
        return 'px-5 py-2.5 text-base';
      case 'icon':
        return 'w-9 h-9 p-0 flex items-center justify-center';
      case 'md':
      default:
        return 'px-3.5 py-1.5 text-xs';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'font-mono font-semibold uppercase tracking-wider rounded-none inline-flex items-center justify-center gap-2 select-none transition-transform duration-75',
        getVariantStyles(),
        getSizeStyles(),
        disabled && 'opacity-50 cursor-not-allowed active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#1A1715]',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin font-mono">◓</span>
      ) : null}
      {children}
    </button>
  );
};
