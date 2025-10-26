import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  buttonBoundingBox: DOMRect | null;
  setButtonBoundingBox: Dispatch<SetStateAction<DOMRect | null>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [buttonBoundingBox, setButtonBoundingBox] = useState<DOMRect | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = storedTheme || preferredTheme;
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
  // The original JSX was causing parsing errors because this file is not a .tsx file.
  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, toggleTheme, buttonBoundingBox, setButtonBoundingBox } },
    children
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
