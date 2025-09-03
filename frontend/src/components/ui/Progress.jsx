import React from 'react';

const Progress = ({ current = 1, total = 3 }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${
            index + 1 === current
              ? 'bg-primary-500'
              : index + 1 < current
              ? 'bg-primary-300'
              : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default Progress;