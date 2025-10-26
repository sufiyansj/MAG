
import React from 'react';

// FIX: Implement the CatIcon component.
const CatIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 9.5a5 5 0 0 0-8 0" />
    <path d="M12 13.5c-1.657 0-3 1.567-3 3.5 0 1.5 1 2 3 2s3-.5 3-2c0-1.933-1.343-3.5-3-3.5z" />
    <path d="M19.5 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <path d="M5.5 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <path d="M14 6.5l-1-1-1 1" />
    <path d="M10 6.5l-1-1-1 1" />
  </svg>
);

export default CatIcon;
