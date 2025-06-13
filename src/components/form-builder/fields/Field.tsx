import React, { memo } from 'react';
import { Field as FieldType } from '@/types/form';
import { ChevronUp, ChevronDown, X, Copy, Settings } from 'lucide-react';
import FieldPreview from './FieldPreview';
import FieldSettings from './FieldSettings';

interface FieldProps {
  field: FieldType;
  index: number;
  totalFields: number;
  activeFieldId: string | null;
  isActive: boolean;
  isDragging: boolean;
  provided: any;
  onMoveField: (fieldId: string, direction: 'up' | 'down') => void;
  onDuplicateField: (fieldId: string) => void;
  onToggleSettings: (fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
  onFieldSettingsChange: (fieldId: string, updates: Partial<FieldType>) => void;
}

const Field = memo(({
  field,
  index,
  totalFields,
  activeFieldId,
  isActive,
  isDragging,
  provided,
  onMoveField,
  onDuplicateField,
  onToggleSettings,
  onRemoveField,
  onFieldSettingsChange
}: FieldProps) => {
  return (
    <div
      id={`field-${field.id}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
        isDragging ? 'shadow-lg scale-[1.02] z-10 opacity-90' : 'shadow-sm'
      } ${
        isActive ? 'ring-2 ring-indigo-500 border-indigo-300' : 'hover:border-indigo-200'
      }`}
    >
      <FieldHeader 
        field={field}
        index={index}
        totalFields={totalFields}
        isActive={isActive}
        dragHandleProps={provided.dragHandleProps}
        onMoveField={onMoveField}
        onDuplicateField={onDuplicateField}
        onToggleSettings={onToggleSettings}
        onRemoveField={onRemoveField}
      />
      
      <FieldContent field={field} />
      
      {isActive && (
        <FieldSettings 
          field={field} 
          onChange={(updates) => onFieldSettingsChange(field.id, updates)} 
        />
      )}
    </div>
  );
});

// Field header with controls
const FieldHeader = memo(({
  field,
  index,
  totalFields,
  isActive,
  dragHandleProps,
  onMoveField,
  onDuplicateField,
  onToggleSettings,
  onRemoveField
}: {
  field: FieldType;
  index: number;
  totalFields: number;
  isActive: boolean;
  dragHandleProps: any;
  onMoveField: (fieldId: string, direction: 'up' | 'down') => void;
  onDuplicateField: (fieldId: string) => void;
  onToggleSettings: (fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
}) => {
  return (
    <div 
      {...dragHandleProps}
      className={`px-3 py-1 flex justify-between items-center border-b text-sm ${
        isActive ? 'bg-indigo-50' : 'bg-gray-50'
      } cursor-grab active:cursor-grabbing`}
    >
      <div className="font-medium text-gray-700 flex items-center">
        <span className="mr-1.5 text-xs text-gray-400">#{index + 1}</span>
        {field.type}
      </div>
      <div className="flex items-center space-x-0.5">
        <button 
          onClick={() => onMoveField(field.id, 'up')}
          className="p-0.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          disabled={index === 0}
          title="Move Up"
        >
          <ChevronUp size={13} />
        </button>
        <button 
          onClick={() => onMoveField(field.id, 'down')}
          className="p-0.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          disabled={index === totalFields - 1}
          title="Move Down"
        >
          <ChevronDown size={13} />
        </button>
        <button 
          onClick={() => onDuplicateField(field.id)}
          className="p-0.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          title="Duplicate"
        >
          <Copy size={13} />
        </button>
        <button 
          onClick={() => onToggleSettings(field.id)}
          className={`p-0.5 rounded-md hover:bg-gray-100 ${
            isActive ? 'text-indigo-600 bg-indigo-100' : 'text-gray-500 hover:text-gray-700'
          }`}
          title="Edit Settings"
        >
          <Settings size={13} />
        </button>
        <button 
          onClick={() => onRemoveField(field.id)}
          className="p-0.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
          title="Remove"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
});

// Field content area
const FieldContent = memo(({ field }: { field: FieldType }) => {
  return (
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
  );
});

Field.displayName = 'Field';
FieldHeader.displayName = 'FieldHeader';
FieldContent.displayName = 'FieldContent';

export default Field; 