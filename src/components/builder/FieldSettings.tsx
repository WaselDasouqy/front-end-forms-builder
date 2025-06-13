import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { Field } from '@/types/form';
import { useFormStore } from '@/lib/formStore';

interface FieldSettingsProps {
  field: Field;
  onChange: (updates: Partial<Field>) => void;
}

// Memoized tab button component to prevent unnecessary re-renders
const TabButton = memo(({ 
  isActive, 
  onClick, 
  label 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  label: string 
}) => (
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

// Memoized option item component
const OptionItem = memo(({ 
  option, 
  onChangeOption, 
  onRemoveOption,
  canRemove 
}: { 
  option: { id: string; value: string }; 
  onChangeOption: (id: string, value: string) => void; 
  onRemoveOption: (id: string) => void;
  canRemove: boolean;
}) => (
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
      className="ml-2 text-gray-400 hover:text-red-500"
      disabled={!canRemove}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
));

OptionItem.displayName = 'OptionItem';

// Memoized style option buttons
const StyleOptionButton = memo(({ 
  isActive, 
  onClick, 
  label 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  label: string 
}) => (
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

const FieldSettings = memo(({ field, onChange }: FieldSettingsProps) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'appearance' | 'validation'>('basic');
  const [localAppearance, setLocalAppearance] = useState(field.appearance || {});
  const { saveForm } = useFormStore();
  
  // Prevent calling saveForm directly from the component
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local appearance state with field props
  useEffect(() => {
    setLocalAppearance(field.appearance || {});
  }, [field.id, field.appearance]); // Add field.id to dependencies to ensure proper updates

  // Basic settings
  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ label: e.target.value });
  }, [onChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ description: e.target.value });
  }, [onChange]);

  const handlePlaceholderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ placeholder: e.target.value });
  }, [onChange]);

  const handleRequiredChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ required: e.target.checked });
  }, [onChange]);

  // Appearance settings with debounce to prevent excessive updates
  const handleAppearanceChange = useCallback((property: string, value: any) => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const updatedAppearance = {
      ...localAppearance,
      [property]: value
    };
    
    setLocalAppearance(updatedAppearance);
    
    // Debounce the appearance updates to prevent excessive saves
    timeoutRef.current = setTimeout(() => {
      onChange({
        appearance: updatedAppearance
      });
    }, 300);
  }, [localAppearance, onChange]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Option management for multi-select fields
  const handleAddOption = useCallback(() => {
    if (!field.options) return;
    
    const newOption = {
      id: `option-${Date.now()}`,
      value: `Option ${field.options.length + 1}`
    };
    
    onChange({
      options: [...field.options, newOption]
    });
  }, [field.options, onChange]);

  const handleRemoveOption = useCallback((optionId: string) => {
    if (!field.options) return;
    
    onChange({
      options: field.options.filter(option => option.id !== optionId)
    });
  }, [field.options, onChange]);

  const handleOptionChange = useCallback((optionId: string, value: string) => {
    if (!field.options) return;
    
    onChange({
      options: field.options.map(option => 
        option.id === optionId ? { ...option, value } : option
      )
    });
  }, [field.options, onChange]);

  // Memoize static data
  const borderStyles = useMemo(() => [
    { label: 'Square', value: 'none' },
    { label: 'Rounded', value: 'default' },
    { label: 'More Rounded', value: 'rounded' },
    { label: 'Pill', value: 'pill' },
  ], []);

  const fontSizes = useMemo(() => [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ], []);
  
  const widthOptions = useMemo(() => [
    { label: 'Full Width', value: 'full' },
    { label: 'Half Width', value: 'half' },
    { label: 'One-Third', value: 'third' },
    { label: 'Quarter', value: 'quarter' },
  ], []);

  // Tab change handler
  const handleTabChange = useCallback((tab: 'basic' | 'appearance' | 'validation') => {
    setActiveTab(tab);
  }, []);

  // Render options section if applicable
  const optionsSection = useMemo(() => {
    if (!(field.type === 'multiple-choice' || field.type === 'checkbox' || field.type === 'dropdown')) {
      return null;
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <button 
            type="button" 
            onClick={handleAddOption}
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
              onChangeOption={handleOptionChange}
              onRemoveOption={handleRemoveOption}
              canRemove={(field.options || []).length > 1}
            />
          ))}
        </div>
      </div>
    );
  }, [field.type, field.options, handleAddOption, handleOptionChange, handleRemoveOption]);

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="settings-tabs mb-4 flex border border-gray-200 rounded-md overflow-hidden">
        <TabButton 
          isActive={activeTab === 'basic'} 
          onClick={() => handleTabChange('basic')} 
          label="Basic" 
        />
        <TabButton 
          isActive={activeTab === 'appearance'} 
          onClick={() => handleTabChange('appearance')} 
          label="Appearance" 
        />
        <TabButton 
          isActive={activeTab === 'validation'} 
          onClick={() => handleTabChange('validation')} 
          label="Validation" 
        />
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={handleLabelChange}
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
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Help text for this field"
            />
          </div>
          
          {(field.type === 'short-answer' || 
            field.type === 'long-answer' || 
            field.type === 'email' || 
            field.type === 'phone' || 
            field.type === 'number' || 
            field.type === 'website') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={handlePlaceholderChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Placeholder text"
              />
            </div>
          )}
          
          {optionsSection}
          
          <div className="flex items-center">
            <input
              id={`required-${field.id}`}
              type="checkbox"
              checked={field.required || false}
              onChange={handleRequiredChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-900">
              Required
            </label>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {borderStyles.map((style) => (
                <StyleOptionButton
                  key={style.value}
                  isActive={localAppearance.borderRadius === style.value}
                  onClick={() => handleAppearanceChange('borderRadius', style.value)}
                  label={style.label}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontSizes.map((size) => (
                <StyleOptionButton
                  key={size.value}
                  isActive={localAppearance.labelFontSize === size.value}
                  onClick={() => handleAppearanceChange('labelFontSize', size.value)}
                  label={size.label}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-md mr-3 border border-gray-300"
                style={{ backgroundColor: localAppearance.fieldBorderColor || '#e5e7eb' }}
              />
              <input
                type="color"
                value={localAppearance.fieldBorderColor || '#e5e7eb'}
                onChange={(e) => handleAppearanceChange('fieldBorderColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-md mr-3 border border-gray-300"
                style={{ backgroundColor: localAppearance.fieldBackgroundColor || '#ffffff' }}
              />
              <input
                type="color"
                value={localAppearance.fieldBackgroundColor || '#ffffff'}
                onChange={(e) => handleAppearanceChange('fieldBackgroundColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-md mr-3 border border-gray-300"
                style={{ backgroundColor: localAppearance.fieldTextColor || '#4b5563' }}
              />
              <input
                type="color"
                value={localAppearance.fieldTextColor || '#4b5563'}
                onChange={(e) => handleAppearanceChange('fieldTextColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Width
            </label>
            <div className="grid grid-cols-2 gap-2">
              {widthOptions.map((option) => (
                <StyleOptionButton
                  key={option.value}
                  isActive={localAppearance.width === option.value}
                  onClick={() => handleAppearanceChange('width', option.value)}
                  label={option.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="text-center py-4">
          <p className="text-gray-500">Validation options coming soon</p>
        </div>
      )}
    </div>
  );
});

FieldSettings.displayName = 'FieldSettings';

export default FieldSettings; 