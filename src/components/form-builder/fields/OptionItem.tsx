import React, { memo } from 'react';

interface OptionItemProps {
  option: { id: string; value: string };
  onChangeOption: (id: string, value: string) => void;
  onRemoveOption: (id: string) => void;
  canRemove: boolean;
}

const OptionItem = memo(({ 
  option, 
  onChangeOption, 
  onRemoveOption,
  canRemove 
}: OptionItemProps) => (
  <div className="flex items-center">
    <input
      type="text"
      value={option.value}
      onChange={(e) => onChangeOption(option.id, e.target.value)}
      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    <button
      type="button"
      onClick={() => onRemoveOption(option.id)}
      className={`ml-2 ${canRemove ? 'text-gray-400 hover:text-red-500' : 'text-gray-200 cursor-not-allowed'}`}
      disabled={!canRemove}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
));

OptionItem.displayName = 'OptionItem';

export default OptionItem; 