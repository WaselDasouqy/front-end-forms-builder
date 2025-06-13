import React, { memo } from 'react';
import StyleOptionButton from './StyleOptionButton';

interface AppearanceSettingsProps {
  appearance: Record<string, any>;
  onAppearanceChange: (property: string, value: any) => void;
}

const AppearanceSettings = memo(({
  appearance,
  onAppearanceChange
}: AppearanceSettingsProps) => {
  // Predefined settings options
  const borderStyles = [
    { label: 'Square', value: 'none' },
    { label: 'Rounded', value: 'default' },
    { label: 'More Rounded', value: 'rounded' },
    { label: 'Pill', value: 'pill' },
  ];

  const fontSizes = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];
  
  const widthOptions = [
    { label: 'Full Width', value: 'full' },
    { label: 'Half Width', value: 'half' },
    { label: 'One-Third', value: 'third' },
    { label: 'Quarter', value: 'quarter' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {borderStyles.map((style) => (
            <StyleOptionButton
              key={style.value}
              isActive={appearance.borderRadius === style.value}
              onClick={() => onAppearanceChange('borderRadius', style.value)}
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
              isActive={appearance.labelFontSize === size.value}
              onClick={() => onAppearanceChange('labelFontSize', size.value)}
              label={size.label}
            />
          ))}
        </div>
      </div>
      
      <ColorPickerRow
        label="Border Color"
        value={appearance.fieldBorderColor || '#e5e7eb'}
        onChange={(value) => onAppearanceChange('fieldBorderColor', value)}
      />
      
      <ColorPickerRow
        label="Background Color"
        value={appearance.fieldBackgroundColor || '#ffffff'}
        onChange={(value) => onAppearanceChange('fieldBackgroundColor', value)}
      />
      
      <ColorPickerRow
        label="Text Color"
        value={appearance.fieldTextColor || '#4b5563'}
        onChange={(value) => onAppearanceChange('fieldTextColor', value)}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Width
        </label>
        <div className="grid grid-cols-2 gap-2">
          {widthOptions.map((option) => (
            <StyleOptionButton
              key={option.value}
              isActive={appearance.width === option.value}
              onClick={() => onAppearanceChange('width', option.value)}
              label={option.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// Helper component for color picker rows
const ColorPickerRow = memo(({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center">
        <div 
          className="w-10 h-10 rounded-md mr-3 border border-gray-300"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10"
        />
      </div>
    </div>
  );
});

AppearanceSettings.displayName = 'AppearanceSettings';
ColorPickerRow.displayName = 'ColorPickerRow';

export default AppearanceSettings; 