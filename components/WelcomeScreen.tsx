import React from 'react';
import SparkleIcon from './icons/SparkleIcon';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  // Fallback icon components
  const LightbulbIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const TelescopeIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
    </svg>
  );

  const BookIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

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
