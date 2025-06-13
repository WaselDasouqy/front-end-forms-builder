import React, { useState, useCallback, useMemo, memo } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useFormStore } from '@/lib/formStore';
import { Field } from '@/types/form';
import { ChevronUp, ChevronDown, X, Copy, Settings } from 'lucide-react';
import FieldSettings from './FieldSettings';

interface FormCanvasProps {
  className?: string;
}

// Memoize the field preview to prevent unnecessary re-renders
const FieldPreview = memo(({ field }: { field: Field }) => {
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

FieldPreview.displayName = 'FieldPreview';

const FormCanvas: React.FC<FormCanvasProps> = ({ className = '' }) => {
  const { 
    currentForm, 
    updateForm, 
    reorderFields, 
    removeField, 
    duplicateField,
    updateField
  } = useFormStore();
  
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  if (!currentForm) return null;

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ title: e.target.value });
  }, [updateForm]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateForm({ description: e.target.value });
  }, [updateForm]);

  const handleMoveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = currentForm?.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1 || fieldIndex === undefined) return;
    
    const newIndex = direction === 'up' 
      ? Math.max(0, fieldIndex - 1) 
      : Math.min((currentForm?.fields.length || 0) - 1, fieldIndex + 1);
    
    if (newIndex === fieldIndex) return;
    reorderFields(fieldIndex, newIndex);
  }, [currentForm?.fields, reorderFields]);
  
  const handleFieldSettingsChange = useCallback((fieldId: string, updates: Partial<Field>) => {
    // Apply field updates immediately for real-time preview
    updateField(fieldId, updates);
  }, [updateField]);

  // Auto-scroll to active field
  React.useEffect(() => {
    if (activeFieldId) {
      const fieldElement = document.getElementById(`field-${activeFieldId}`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeFieldId]);

  const toggleFieldSettings = useCallback((fieldId: string) => {
    setActiveFieldId(prevId => prevId === fieldId ? null : fieldId);
  }, []);

  const handleDuplicateField = useCallback((fieldId: string) => {
    duplicateField(fieldId);
  }, [duplicateField]);

  const handleRemoveField = useCallback((fieldId: string) => {
    removeField(fieldId);
    // Clear active field if the removed field was active
    if (activeFieldId === fieldId) {
      setActiveFieldId(null);
    }
  }, [removeField, activeFieldId]);

  // Memoize the empty state to prevent re-rendering
  const emptyState = useMemo(() => (
    <div className="border-2 border-dashed rounded-lg p-4 text-center flex flex-col items-center justify-center h-full
      border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">Add form fields</h3>
      <p className="text-xs text-gray-500">Drag and drop fields from the sidebar into this area</p>
      
      <div className="mt-4 text-xs text-gray-400 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Fields will be added at the top of the form</span>
      </div>
    </div>
  ), []);

  // Memoize the form fields render to reduce re-renders
  const formFields = useMemo(() => (
    currentForm.fields.map((field, index) => (
      <Draggable
        key={field.id}
        draggableId={field.id}
        index={index}
      >
        {(provided, snapshot) => (
          <div
            id={`field-${field.id}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`border rounded-lg overflow-hidden transition-all duration-200 ${
              snapshot.isDragging ? 'shadow-lg scale-[1.02] z-10 opacity-90' : 'shadow-sm'
            } ${
              activeFieldId === field.id ? 'ring-2 ring-indigo-500 border-indigo-300' : 'hover:border-indigo-200'
            }`}
          >
            <div 
              {...provided.dragHandleProps}
              className={`px-3 py-1 flex justify-between items-center border-b text-sm ${
                activeFieldId === field.id ? 'bg-indigo-50' : 'bg-gray-50'
              } cursor-grab active:cursor-grabbing`}
            >
              <div className="font-medium text-gray-700 flex items-center">
                <span className="mr-1.5 text-xs text-gray-400">#{index + 1}</span>
                {field.type}
              </div>
              <div className="flex items-center space-x-0.5">
                <button 
                  onClick={() => handleMoveField(field.id, 'up')}
                  className="p-0.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                  disabled={index === 0}
                  title="Move Up"
                >
                  <ChevronUp size={13} />
                </button>
                <button 
                  onClick={() => handleMoveField(field.id, 'down')}
                  className="p-0.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                  disabled={index === currentForm.fields.length - 1}
                  title="Move Down"
                >
                  <ChevronDown size={13} />
                </button>
                <button 
                  onClick={() => handleDuplicateField(field.id)}
                  className="p-0.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                  title="Duplicate"
                >
                  <Copy size={13} />
                </button>
                <button 
                  onClick={() => toggleFieldSettings(field.id)}
                  className={`p-0.5 rounded-md hover:bg-gray-100 ${
                    activeFieldId === field.id ? 'text-indigo-600 bg-indigo-100' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Edit Settings"
                >
                  <Settings size={13} />
                </button>
                <button 
                  onClick={() => handleRemoveField(field.id)}
                  className="p-0.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
            
            <div className="p-2.5 bg-white">
              <div className="mb-1 font-medium text-gray-900 text-sm">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              {field.description && (
                <div className="mb-2 text-xs text-gray-500">{field.description}</div>
              )}
              
              {/* Preview of the field based on type */}
              <div className="mt-2 transition-all duration-200">
                <FieldPreview field={field} />
              </div>
            </div>
            
            {/* Field settings panel that shows when the field is active */}
            {activeFieldId === field.id && (
              <FieldSettings 
                field={field} 
                onChange={(updates) => handleFieldSettingsChange(field.id, updates)} 
              />
            )}
          </div>
        )}
      </Draggable>
    ))
  ), [
    currentForm.fields,
    activeFieldId,
    handleMoveField,
    handleDuplicateField,
    toggleFieldSettings,
    handleRemoveField,
    handleFieldSettingsChange
  ]);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full ${className}`}>
      <div className="p-2 border-b border-gray-200 bg-indigo-50 flex items-center shrink-0">
        <div className="p-1 rounded-md bg-indigo-100 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-900">Form Canvas</h2>
      </div>
      
      <div className="p-2 border-b border-gray-200 bg-white shrink-0">
        <div className="mb-1.5">
          <label htmlFor="form-title" className="block text-xs font-medium text-gray-700 mb-1">
            Form Title
          </label>
          <input
            id="form-title"
            type="text"
            value={currentForm.title}
            onChange={handleTitleChange}
            placeholder="Enter form title"
            className="w-full px-2.5 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        <div>
          <label htmlFor="form-description" className="block text-xs font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="form-description"
            value={currentForm.description}
            onChange={handleDescriptionChange}
            placeholder="Enter form description"
            rows={2}
            className="w-full px-2.5 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>
      
      <Droppable droppableId="form-canvas">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 flex-1 overflow-y-auto transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-indigo-50' : ''
            }`}
          >
            {currentForm.fields.length > 0 ? (
              <div className="space-y-1.5">
                {formFields}
              </div>
            ) : (
              snapshot.isDraggingOver ? (
                <div className="border-2 border-dashed rounded-lg p-4 text-center h-full border-indigo-300 bg-indigo-50 transition-colors duration-200">
                  <p className="text-indigo-500 font-medium">Drop your field here</p>
                </div>
              ) : emptyState
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

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

export default memo(FormCanvas); 