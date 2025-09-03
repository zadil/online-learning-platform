import React from 'react';
import { cn } from '@/lib/utils';

const ProgressSteps = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("flex justify-center items-center space-x-4 mb-8", className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200",
                isActive && "w-4 h-4 bg-blue-500 shadow-lg",
                isCompleted && "w-3 h-3 bg-gray-300",
                !isActive && !isCompleted && "w-3 h-3 bg-gray-200"
              )}
            >
              {isActive && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-200 max-w-8" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export { ProgressSteps };