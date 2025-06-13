import React, { useState, useCallback, useMemo, memo } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useFormStore } from '@/lib/formStore';
import { Field as FieldType } from '@/types/form';
import Field from '../fields/Field';
import EmptyCanvas from './EmptyCanvas';
import FormHeader from './FormHeader';

interface FormCanvasProps {
  className?: string;
}

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
  
  const handleFieldSettingsChange = useCallback((fieldId: string, updates: Partial<FieldType>) => {
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
      
      <FormHeader
        title={currentForm.title}
        description={currentForm.description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
      />
      
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
                {currentForm.fields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Field
                        field={field}
                        index={index}
                        totalFields={currentForm.fields.length}
                        activeFieldId={activeFieldId}
                        isActive={activeFieldId === field.id}
                        isDragging={snapshot.isDragging}
                        provided={provided}
                        onMoveField={handleMoveField}
                        onDuplicateField={handleDuplicateField}
                        onToggleSettings={toggleFieldSettings}
                        onRemoveField={handleRemoveField}
                        onFieldSettingsChange={handleFieldSettingsChange}
                      />
                    )}
                  </Draggable>
                ))}
              </div>
            ) : (
              <EmptyCanvas isDraggingOver={snapshot.isDraggingOver} />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(FormCanvas); 