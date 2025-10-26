import React, { useState } from 'react';
import NewChatIcon from './icons/NewChatIcon';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import ThemeToggleButton from './ThemeToggleButton';

interface SidebarProps {
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-20 md:hidden p-2 rounded-full bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <aside
        className={`absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col z-10`}
      >
        <div className="p-4 flex-1">
          <button
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <NewChatIcon />
            New Chat
          </button>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
           <ThemeToggleButton />
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
