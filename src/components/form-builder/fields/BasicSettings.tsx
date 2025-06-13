import React, { memo } from 'react';
import { Field } from '@/types/form';
import OptionItem from './OptionItem';

interface BasicSettingsProps {
  field: Field;
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceholderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRequiredChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onOptionChange: (optionId: string, value: string) => void;
}

const BasicSettings = memo(({
  field,
  onLabelChange,
  onDescriptionChange,
  onPlaceholderChange,
  onRequiredChange,
  onAddOption,
  onRemoveOption,
  onOptionChange
}: BasicSettingsProps) => {
  // Check if this field type supports options
  const supportsOptions = field.type === 'multiple-choice' || 
                          field.type === 'checkbox' || 
                          field.type === 'dropdown';
  
  // Check if this field type supports placeholder
  const supportsPlaceholder = field.type === 'short-answer' || 
                              field.type === 'long-answer' || 
                              field.type === 'email' || 
                              field.type === 'phone' || 
                              field.type === 'number' || 
                              field.type === 'website';
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          type="text"
          value={field.label}
          onChange={onLabelChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={field.description || ''}
          onChange={onDescriptionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Help text for this field"
        />
      </div>
      
      {supportsPlaceholder && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={onPlaceholderChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Placeholder text"
          />
        </div>
      )}
      
      {supportsOptions && (
        <OptionsSection
          field={field}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
          onOptionChange={onOptionChange}
        />
      )}
      
      <div className="flex items-center">
        <input
          id={`required-${field.id}`}
          type="checkbox"
          checked={field.required || false}
          onChange={onRequiredChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-900">
          Required
        </label>
      </div>
    </div>
  );
});

// Options section for multiple choice, checkbox, and dropdown fields
const OptionsSection = memo(({
  field,
  onAddOption,
  onRemoveOption,
  onOptionChange
}: {
  field: Field;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onOptionChange: (optionId: string, value: string) => void;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        <button 
          type="button" 
          onClick={onAddOption}
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          + Add Option
        </button>
      </div>
      <div className="space-y-2">
        {(field.options || []).map((option) => (
          <OptionItem 
            key={option.id}
            option={option}
            onChangeOption={onOptionChange}
            onRemoveOption={onRemoveOption}
            canRemove={(field.options || []).length > 1}
          />
        ))}
      </div>
    </div>
  );
});

BasicSettings.displayName = 'BasicSettings';
OptionsSection.displayName = 'OptionsSection';

export default BasicSettings; 