import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-blue-500"></div>
    </div>
  );
};

export default LoadingIndicator;
