import React from 'react';
import { cn } from '@/lib/utils';

interface AnalogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'well' | 'elevated';
  shadowSize?: 'sm' | 'md' | 'lg' | 'none';
  headerTitle?: string;
  headerEyebrow?: string;
  headerAction?: React.ReactNode;
}

export const AnalogCard: React.FC<AnalogCardProps> = ({
  children,
  className,
  variant = 'card',
  shadowSize = 'md',
  headerTitle,
  headerEyebrow,
  headerAction,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'well':
        return 'bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[inset_2px_2px_0px_rgba(26,23,21,0.15)]';
      case 'elevated':
        return 'bg-white border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715]';
      case 'card':
      default: {
        const shadow =
          shadowSize === 'lg'
            ? 'shadow-[5px_5px_0px_#1A1715]'
            : shadowSize === 'sm'
            ? 'shadow-[1.5px_1.5px_0px_#1A1715]'
            : shadowSize === 'none'
            ? 'shadow-none'
            : 'shadow-[3px_3px_0px_#1A1715]';
        return `bg-[#FAF7F0] border-[1.5px] border-[#1A1715] ${shadow}`;
      }
    }
  };

  return (
    <div className={cn('rounded-none transition-all', getVariantClasses(), className)} {...props}>
      {(headerTitle || headerEyebrow || headerAction) && (
        <div className="flex items-center justify-between border-b-[1.5px] border-[#1A1715] px-4 py-2.5 bg-[#F4EFE4]/60">
          <div>
            {headerEyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#C83226]">
                {headerEyebrow}
              </p>
            )}
            {headerTitle && (
              <h3 className="font-mono text-sm font-bold tracking-tight text-[#1A1715]">
                {headerTitle}
              </h3>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};
