import React from 'react';
import CatIcon from './icons/CatIcon';

const ModelAvatar: React.FC = () => {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
      <CatIcon className="h-5 w-5" />
    </div>
  );
};

export default ModelAvatar;