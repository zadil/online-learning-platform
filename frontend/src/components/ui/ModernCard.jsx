import React from 'react';
import { cn } from '@/lib/utils';

const ModernCard = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = 'shadow-card',
  hover = true,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100',
        shadow,
        hover && 'hover:shadow-card-hover transition-all duration-200',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={cn('mb-6', className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

export { ModernCard, CardHeader, CardTitle, CardContent };