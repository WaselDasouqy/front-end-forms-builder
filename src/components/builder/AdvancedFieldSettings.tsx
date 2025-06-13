import { Field } from "@/types/form";
import { useState } from "react";

interface AdvancedFieldSettingsProps {
  field: Field;
  onUpdate: (updates: Partial<Field>) => void;
}

export default function AdvancedFieldSettings({ field, onUpdate }: AdvancedFieldSettingsProps) {
  const [activeTab, setActiveTab] = useState<'styling' | 'validation' | 'logic' | 'advanced'>('styling');
  
  const handleAppearanceChange = (key: string, value: any) => {
    const appearance = field.appearance ? { ...field.appearance } : {};
    appearance[key as keyof typeof appearance] = value;
    onUpdate({ appearance });
  };

  const handleValidationChange = (key: string, value: any) => {
    const validation = field.validation ? { ...field.validation } : {};
    validation[key as keyof typeof validation] = value;
    onUpdate({ validation });
  };

  return (
    <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Tabs Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('styling')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'styling'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Styling
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'validation'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Validation
          </button>
          <button
            onClick={() => setActiveTab('logic')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'logic'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Logic
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'advanced'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Advanced
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'styling' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Appearance Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Label Position */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label Position
                </label>
                <select
                  value={field.appearance?.labelPosition || 'top'}
                  onChange={(e) => handleAppearanceChange('labelPosition', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="top">Top</option>
                  <option value="left">Left</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              {/* Field Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Field Size
                </label>
                <select
                  value={field.appearance?.fieldSize || 'medium'}
                  onChange={(e) => handleAppearanceChange('fieldSize', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Label Font Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label Font Size
                </label>
                <select
                  value={field.appearance?.labelFontSize || 'medium'}
                  onChange={(e) => handleAppearanceChange('labelFontSize', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Field Width */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Field Width
                </label>
                <select
                  value={field.appearance?.width || 'full'}
                  onChange={(e) => handleAppearanceChange('width', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="full">Full Width</option>
                  <option value="half">Half Width</option>
                  <option value="third">One Third</option>
                  <option value="quarter">One Quarter</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Label Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={field.appearance?.labelColor || '#111827'}
                    onChange={(e) => handleAppearanceChange('labelColor', e.target.value)}
                    className="w-8 h-8 p-0 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={field.appearance?.labelColor || '#111827'}
                    onChange={(e) => handleAppearanceChange('labelColor', e.target.value)}
                    className="ml-2 w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={field.appearance?.fieldBackgroundColor || '#ffffff'}
                    onChange={(e) => handleAppearanceChange('fieldBackgroundColor', e.target.value)}
                    className="w-8 h-8 p-0 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={field.appearance?.fieldBackgroundColor || '#ffffff'}
                    onChange={(e) => handleAppearanceChange('fieldBackgroundColor', e.target.value)}
                    className="ml-2 w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={field.appearance?.fieldBorderColor || '#e5e7eb'}
                    onChange={(e) => handleAppearanceChange('fieldBorderColor', e.target.value)}
                    className="w-8 h-8 p-0 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={field.appearance?.fieldBorderColor || '#e5e7eb'}
                    onChange={(e) => handleAppearanceChange('fieldBorderColor', e.target.value)}
                    className="ml-2 w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={field.appearance?.fieldTextColor || '#111827'}
                    onChange={(e) => handleAppearanceChange('fieldTextColor', e.target.value)}
                    className="w-8 h-8 p-0 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={field.appearance?.fieldTextColor || '#111827'}
                    onChange={(e) => handleAppearanceChange('fieldTextColor', e.target.value)}
                    className="ml-2 w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Alignment */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Alignment
                </label>
                <select
                  value={field.appearance?.alignment || 'left'}
                  onChange={(e) => handleAppearanceChange('alignment', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Weight
                </label>
                <select
                  value={field.appearance?.fontWeight || 'normal'}
                  onChange={(e) => handleAppearanceChange('fontWeight', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              {/* Font Style */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Style
                </label>
                <select
                  value={field.appearance?.fontStyle || 'normal'}
                  onChange={(e) => handleAppearanceChange('fontStyle', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Radius
                </label>
                <select
                  value={field.appearance?.borderRadius || 'default'}
                  onChange={(e) => handleAppearanceChange('borderRadius', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="none">None</option>
                  <option value="default">Default</option>
                  <option value="rounded">Rounded</option>
                  <option value="pill">Pill</option>
                </select>
              </div>

              {/* Border Style */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Style
                </label>
                <select
                  value={field.appearance?.borderStyle || 'solid'}
                  onChange={(e) => handleAppearanceChange('borderStyle', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>

              {/* Border Width */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Width
                </label>
                <select
                  value={field.appearance?.borderWidth || '1'}
                  onChange={(e) => handleAppearanceChange('borderWidth', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="0">None</option>
                  <option value="1">Thin</option>
                  <option value="2">Medium</option>
                  <option value="4">Thick</option>
                </select>
              </div>
            </div>

            {/* Animation Effect */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Animation Effect
              </label>
              <select
                value={field.appearance?.animation || 'none'}
                onChange={(e) => handleAppearanceChange('animation', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>

            {/* Custom CSS Classes */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Custom CSS Classes
              </label>
              <input
                type="text"
                value={field.appearance?.customCssClasses || ''}
                onChange={(e) => handleAppearanceChange('customCssClasses', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="E.g. my-custom-class another-class"
              />
            </div>

            {/* Advanced CSS */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-700">
                  Custom CSS
                </label>
                <span className="text-xs text-gray-500">Advanced</span>
              </div>
              <textarea
                value={field.appearance?.customCss || ''}
                onChange={(e) => handleAppearanceChange('customCss', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-1 font-mono h-24"
                placeholder="E.g. { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }"
              />
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Validation Rules</h3>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id={`required-${field.id}`}
                checked={field.required || false}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`required-${field.id}`} className="ml-2 text-sm text-gray-700">
                Required Field
              </label>
            </div>
            
            {(field.type === 'short-answer' || field.type === 'long-answer' || field.type === 'email') && (
              <div className="grid grid-cols-2 gap-4">
                {/* Min Length */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={field.validation?.minLength || ''}
                    onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value) || '')}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Max Length */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Maximum Length
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={field.validation?.maxLength || ''}
                    onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value) || '')}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {field.type === 'number' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Min Value */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={field.validation?.min || ''}
                    onChange={(e) => handleValidationChange('min', parseFloat(e.target.value) || '')}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Max Value */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={field.validation?.max || ''}
                    onChange={(e) => handleValidationChange('max', parseFloat(e.target.value) || '')}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Step */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Step
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={field.validation?.step || ''}
                    onChange={(e) => handleValidationChange('step', parseFloat(e.target.value) || '')}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Pattern (Regex) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pattern (Regular Expression)
              </label>
              <input
                type="text"
                value={field.validation?.pattern || ''}
                onChange={(e) => handleValidationChange('pattern', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="E.g. ^[a-zA-Z0-9]+$"
              />
            </div>

            {/* Custom Error Message */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Custom Error Message
              </label>
              <input
                type="text"
                value={field.validation?.customErrorMessage || ''}
                onChange={(e) => handleValidationChange('customErrorMessage', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="E.g. Please enter a valid value"
              />
            </div>
          </div>
        )}

        {activeTab === 'logic' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Conditional Logic</h3>
            
            <div className="p-4 bg-gray-50 rounded-md text-center">
              <p className="text-sm text-gray-500">
                Conditional logic functionality will be implemented in a future update.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Advanced Settings</h3>
            
            <div className="space-y-3">
              {/* Read Only */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`readonly-${field.id}`}
                  checked={field.isReadOnly || false}
                  onChange={(e) => onUpdate({ isReadOnly: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`readonly-${field.id}`} className="ml-2 text-sm text-gray-700">
                  Read Only
                </label>
              </div>

              {/* Hidden Field */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`hidden-${field.id}`}
                  checked={field.isHidden || false}
                  onChange={(e) => onUpdate({ isHidden: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`hidden-${field.id}`} className="ml-2 text-sm text-gray-700">
                  Hidden Field
                </label>
              </div>

              {/* Help Text */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Help Text
                </label>
                <input
                  type="text"
                  value={field.helpText || ''}
                  onChange={(e) => onUpdate({ helpText: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add helpful information for users"
                />
              </div>

              {/* Field ID */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Field ID
                </label>
                <input
                  type="text"
                  value={field.id || ''}
                  readOnly
                  className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">This is a unique identifier for the field.</p>
              </div>

              {/* Data Binding */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Binding Key
                </label>
                <input
                  type="text"
                  value={field.dataBindingKey || ''}
                  onChange={(e) => onUpdate({ dataBindingKey: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="E.g. user.firstName"
                />
                <p className="mt-1 text-xs text-gray-500">Used for mapping form data to your system.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 