import React, { memo, useMemo } from 'react';
import { Field } from '@/types/form';

interface FieldPreviewProps {
  field: Field;
}

const FieldPreview = memo(({ field }: FieldPreviewProps) => {
  // Apply field styles
  const fieldStyles = useMemo(() => {
    const styles: Record<string, string> = field.appearance ? {
      backgroundColor: field.appearance.fieldBackgroundColor || 'white',
      borderColor: field.appearance.fieldBorderColor || '#d1d5db',
      color: field.appearance.fieldTextColor || '#4b5563',
      transition: 'all 0.2s ease-in-out',
    } : { transition: 'all 0.2s ease-in-out' };
    
    // Apply border radius
    if (field.appearance?.borderRadius) {
      switch(field.appearance.borderRadius) {
        case 'none': 
          styles.borderRadius = '0';
          break;
        case 'default': 
          styles.borderRadius = '0.375rem';
          break;
        case 'rounded': 
          styles.borderRadius = '0.5rem';
          break;
        case 'pill': 
          styles.borderRadius = '9999px';
          break;
      }
    }

    return styles;
  }, [field.appearance]);

  return renderFieldPreview(field, fieldStyles);
});

// Helper function to render the preview of a field based on its type
const renderFieldPreview = (field: Field, fieldStyles: Record<string, string>) => {
  switch (field.type) {
    case 'short-answer':
      return (
        <input
          type="text"
          placeholder={field.placeholder || 'Short answer text'}
          disabled
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        />
      );
    case 'long-answer':
      return (
        <textarea
          placeholder={field.placeholder || 'Long answer text'}
          disabled
          rows={3}
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        />
      );
    case 'multiple-choice':
      return (
        <div className="space-y-1 text-xs">
          {(field.options || []).map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                disabled
                className="h-3 w-3 text-indigo-600 border-gray-300"
              />
              <label className="ml-2 text-gray-700" style={fieldStyles}>{option.value}</label>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-1 text-xs">
          {(field.options || []).map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                disabled
                className="h-3 w-3 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-gray-700" style={fieldStyles}>{option.value}</label>
            </div>
          ))}
        </div>
      );
    // Additional field types are defined in separate components for better organization
    default:
      return <DefaultFieldPreview field={field} fieldStyles={fieldStyles} />;
  }
};

FieldPreview.displayName = 'FieldPreview';

export default FieldPreview;

// Split out remaining field types to a separate component
const DefaultFieldPreview = ({ field, fieldStyles }: { field: Field, fieldStyles: Record<string, string> }) => {
  switch (field.type) {
    case 'dropdown':
      return (
        <select
          disabled
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        >
          <option value="">Select an option</option>
          {(field.options || []).map((option) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
      );
    case 'date':
      return (
        <input
          type="date"
          disabled
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        />
      );
    case 'email':
      return (
        <input
          type="email"
          placeholder={field.placeholder || 'email@example.com'}
          disabled
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        />
      );
    case 'phone':
      return (
        <input
          type="tel"
          placeholder={field.placeholder || '(123) 456-7890'}
          disabled
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          placeholder={field.placeholder || '0'}
          disabled
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        />
      );
    case 'website':
      return (
        <input
          type="url"
          placeholder={field.placeholder || 'https://example.com'}
          disabled
          className="w-full px-2.5 py-1 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-xs"
          style={fieldStyles}
        />
      );
    case 'file-upload':
      return (
        <div 
          className="w-full px-2.5 py-2 border rounded-md shadow-sm bg-gray-50 text-gray-500 text-center text-xs"
          style={fieldStyles}
        >
          <p>Click to upload or drag and drop</p>
          <p className="text-xs mt-1">Max file size: 10MB</p>
        </div>
      );
    case 'section-break':
      return (
        <div className="py-1 border-t border-gray-300">
          <h3 className="text-gray-700 font-medium text-xs" style={fieldStyles}>{field.label || 'Section Title'}</h3>
        </div>
      );
    default:
      return <div className="text-gray-500 text-xs">Preview not available</div>;
  }
}; 