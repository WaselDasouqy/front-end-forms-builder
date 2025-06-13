import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Field } from '@/types/form';
import TabButton from './TabButton';
import BasicSettings from './BasicSettings';
import AppearanceSettings from './AppearanceSettings';

interface FieldSettingsProps {
  field: Field;
  onChange: (updates: Partial<Field>) => void;
}

const FieldSettings = memo(({ field, onChange }: FieldSettingsProps) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'appearance' | 'validation'>('basic');
  const [localAppearance, setLocalAppearance] = useState(field.appearance || {});
  
  // Prevent calling onChange directly from the component
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local appearance state with field props
  useEffect(() => {
    setLocalAppearance(field.appearance || {});
  }, [field.id, field.appearance]); 

  // Handle tab change
  const handleTabChange = useCallback((tab: 'basic' | 'appearance' | 'validation') => {
    setActiveTab(tab);
  }, []);

  // Basic settings handlers
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
        <BasicSettings
          field={field}
          onLabelChange={handleLabelChange}
          onDescriptionChange={handleDescriptionChange}
          onPlaceholderChange={handlePlaceholderChange}
          onRequiredChange={handleRequiredChange}
          onAddOption={handleAddOption}
          onRemoveOption={handleRemoveOption}
          onOptionChange={handleOptionChange}
        />
      )}

      {activeTab === 'appearance' && (
        <AppearanceSettings
          appearance={localAppearance}
          onAppearanceChange={handleAppearanceChange}
        />
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