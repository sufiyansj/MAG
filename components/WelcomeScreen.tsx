import React from 'react';
import SparkleIcon from './icons/SparkleIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import TelescopeIcon from './icons/TelescopeIcon';
import BookIcon from './icons/BookIcon';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  const prompts = [
    {
      icon: <LightbulbIcon />,
      title: 'Brainstorm ideas',
      text: 'for a new fantasy novel series',
    },
    {
      icon: <TelescopeIcon />,
      title: 'Help me debug',
      text: 'a tricky React component',
    },
    {
      icon: <BookIcon />,
      title: 'Summarize the plot',
      text: 'of The Great Gatsby',
    },
    {
      icon: <SparkleIcon />,
      title: 'Write a poem',
      text: 'about the beauty of a sunset',
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-4">
      <div className="mb-8">
        <SparkleIcon className="h-16 w-16 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold mb-4">How can I help you today?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-3xl">
        {prompts.map((prompt) => (
          <button
            key={prompt.title}
            onClick={() => onPromptClick(`${prompt.title} ${prompt.text}`)}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
                {prompt.icon}
                <div>
                    <h3 className="font-semibold">{prompt.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{prompt.text}</p>
                </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
