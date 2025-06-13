import React, { memo } from 'react';

interface StyleOptionButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

const StyleOptionButton = memo(({ isActive, onClick, label }: StyleOptionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 border text-sm font-medium rounded-md focus:outline-none ${
      isActive
        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
));

StyleOptionButton.displayName = 'StyleOptionButton';

export default StyleOptionButton; 