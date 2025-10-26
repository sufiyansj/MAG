import React from 'react';

const AskAnythingMenu: React.FC = () => {
  return (
    <div className="absolute bottom-full mb-2 w-full max-w-md rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <h3 className="font-semibold mb-2">Prompt starters</h3>
        <ul>
          <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
            Explain quantum computing in simple terms
          </li>
          <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
            Create a workout plan for a beginner
          </li>
          <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
            Write a thank you note to a colleague
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AskAnythingMenu;
