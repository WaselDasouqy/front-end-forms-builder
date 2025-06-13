import React, { memo } from 'react';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

const TabButton = memo(({ isActive, onClick, label }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${isActive 
      ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' 
      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
  >
    {label}
  </button>
));

TabButton.displayName = 'TabButton';

export default TabButton; 