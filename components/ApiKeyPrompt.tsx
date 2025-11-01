import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';

interface ApiKeyPromptProps {
  onApiKeySet: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const { setApiKey: saveApiKey } = useChat();

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    
    try {
      saveApiKey(apiKey.trim());
      onApiKeySet();
    } catch (err) {
      setError('Failed to save API key. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            OpenRouter API Key Required
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          To use MAG AI, you need to provide an OpenRouter API key. Your key will be stored securely in your browser's local storage.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setError('');
          }}
          placeholder="sk-or-..."
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="text-xs text-gray-500 mt-2">
          You can get your key from the{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            OpenRouter Console
          </a>
          .
        </p>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;