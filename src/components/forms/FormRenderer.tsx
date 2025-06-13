"use client";

import { useState, useCallback } from 'react';
import { Form, Field } from '@/types/form';

interface FormRendererProps {
  form: Form;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

export default function FormRenderer({ form, onSubmit, isSubmitting = false }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  const theme = form.settings?.theme;
  const isDark = theme?.mode === 'dark';

  const containerStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f9fafb' : '#111827'
  };

  return (
    <div 
      className="rounded-lg shadow-sm border p-6"
      style={containerStyle}
    >
      {/* Form Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600 dark:text-gray-300">{form.description}</p>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={handleFieldChange}
            theme={theme}
          />
        ))}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-medium transition-colors"
            style={{
              backgroundColor: theme?.primaryColor || '#4f46e5'
            }}
          >
            {isSubmitting ? 'Submitting...' : (form.settings?.submitButtonText || 'Submit')}
          </button>
        </div>
      </form>
    </div>
  );
}

// Individual field renderer component
function FormField({ 
  field, 
  value, 
  onChange, 
  theme 
}: { 
  field: Field; 
  value: any; 
  onChange: (fieldId: string, value: any) => void;
  theme?: any;
}) {
  if (field.isHidden) return null;

  const isDark = theme?.mode === 'dark';
  const fieldStyle = {
    backgroundColor: isDark ? '#374151' : '#ffffff',
    borderColor: isDark ? '#4b5563' : '#d1d5db',
    color: isDark ? '#f9fafb' : '#111827'
  };

  return (
    <div className="space-y-2">
      {field.type !== 'section-break' && (
        <>
          <label className="block font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {field.description}
            </p>
          )}
        </>
      )}
      
      {renderFieldInput(field, value, onChange, fieldStyle)}
    </div>
  );
}

// Field input renderer based on field type
function renderFieldInput(
  field: Field, 
  value: any, 
  onChange: (fieldId: string, value: any) => void,
  style: React.CSSProperties
) {
  const baseClasses = "w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  switch (field.type) {
    case 'short-answer':
    case 'name':
      return (
        <input
          type="text"
          className={baseClasses}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          required={field.required}
          style={style}
        />
      );

    case 'long-answer':
      return (
        <textarea
          className={baseClasses}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          required={field.required}
          rows={4}
          style={style}
        />
      );

    case 'email':
      return (
        <input
          type="email"
          className={baseClasses}
          placeholder={field.placeholder || 'email@example.com'}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          required={field.required}
          style={style}
        />
      );

    case 'multiple-choice':
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <label key={option.id} className="flex items-center">
              <input
                type="radio"
                name={field.id}
                value={option.id}
                checked={value === option.id}
                onChange={() => onChange(field.id, option.id)}
                required={field.required}
                className="mr-2"
              />
              {option.value}
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <label key={option.id} className="flex items-center">
              <input
                type="checkbox"
                value={option.id}
                checked={Array.isArray(value) && value.includes(option.id)}
                onChange={(e) => {
                  const currentValues = Array.isArray(value) ? [...value] : [];
                  if (e.target.checked) {
                    onChange(field.id, [...currentValues, option.id]);
                  } else {
                    onChange(field.id, currentValues.filter(v => v !== option.id));
                  }
                }}
                className="mr-2"
              />
              {option.value}
            </label>
          ))}
        </div>
      );

    default:
      return (
        <input
          type="text"
          className={baseClasses}
          placeholder="Enter your answer"
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          required={field.required}
          style={style}
        />
      );
  }
} 