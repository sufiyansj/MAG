import React from 'react';
import UserIcon from './icons/UserIcon';

const UserAvatar: React.FC = () => {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
      <UserIcon />
    </div>
  );
};

export default UserAvatar;
