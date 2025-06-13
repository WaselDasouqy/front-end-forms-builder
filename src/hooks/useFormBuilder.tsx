import { useState } from 'react';
import { nanoid } from 'nanoid';
import { FieldType } from '@/types/form';

// Map our simple field types to the proper field types from the app
const fieldTypeMap: Record<string, FieldType> = {
  'text': 'short-answer',
  'textarea': 'long-answer',
  'checkbox': 'checkbox',
  'select': 'dropdown',
  'date': 'date',
  'email': 'email',
  'number': 'number',
  'tel': 'phone',
  'file': 'file-upload',
  'name': 'name',
  'address': 'address',
  'time': 'time',
  'signature': 'signature',
  'rating': 'rating',
  'likert': 'likert',
  'website': 'website',
  'section': 'section-break',
  'multiple-choice': 'multiple-choice'
};

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { id: string; value: string }[];
  description?: string;
}

export interface FormData {
  title: string;
  description: string;
  fields: FormField[];
}

export const useFormBuilder = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    fields: [],
  });
  
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  const addField = (fieldType: string) => {
    // Map simple type to proper field type
    const mappedType = fieldTypeMap[fieldType] || fieldType as FieldType;
    
    // Default field labels based on type
    const getDefaultLabel = () => {
      switch (mappedType) {
        case 'short-answer': return 'Short Answer Question';
        case 'long-answer': return 'Long Answer Question';
        case 'multiple-choice': return 'Multiple Choice Question';
        case 'checkbox': return 'Checkbox Question';
        case 'dropdown': return 'Dropdown Question';
        case 'date': return 'Date';
        case 'email': return 'Email Address';
        case 'phone': return 'Phone Number';
        case 'number': return 'Number';
        case 'file-upload': return 'File Upload';
        default: return `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Question`;
      }
    };
    
    // Create options for multi-select field types
    const getDefaultOptions = () => {
      if (['checkbox', 'dropdown', 'multiple-choice'].includes(mappedType)) {
        return [
          { id: nanoid(), value: 'Option 1' },
          { id: nanoid(), value: 'Option 2' },
          { id: nanoid(), value: 'Option 3' },
        ];
      }
      return undefined;
    };
    
    // Default placeholder text based on type
    const getDefaultPlaceholder = () => {
      switch (mappedType) {
        case 'short-answer': return 'Type your answer here';
        case 'long-answer': return 'Type your detailed answer here';
        case 'email': return 'email@example.com';
        case 'phone': return '(123) 456-7890';
        case 'number': return '0';
        case 'website': return 'https://example.com';
        default: return '';
      }
    };

    const newField: FormField = {
      id: `field-${nanoid()}`,
      type: mappedType,
      label: getDefaultLabel(),
      placeholder: getDefaultPlaceholder(),
      required: false,
      options: getDefaultOptions(),
      description: '',
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    setActiveFieldId(newField.id);
  };

  const updateField = (fieldId: string, fieldData: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...fieldData } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    
    if (activeFieldId === fieldId) {
      setActiveFieldId(null);
    }
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    setFormData(prev => {
      const newFields = [...prev.fields];
      const draggedField = newFields[dragIndex];
      newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, draggedField);
      return {
        ...prev,
        fields: newFields
      };
    });
  };

  return {
    formData,
    setFormData,
    activeFieldId,
    setActiveFieldId,
    addField,
    updateField,
    removeField,
    moveField
  };
}; 