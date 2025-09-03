import React from 'react';
import { cn } from '@/lib/utils';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {Icon && (
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        
        {trend && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            <svg 
              className={cn("w-4 h-4 mr-1", trend === 'up' ? "rotate-0" : "rotate-180")}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5" />
            </svg>
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};

export { MetricCard };