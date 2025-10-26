import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
    </div>
  );
};

export default LoadingDots;
