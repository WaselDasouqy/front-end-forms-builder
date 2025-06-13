// Global type declarations for form builder components
declare module '@/components/form-builder' {
  import { FC, ReactNode } from 'react';
  import { Field as FieldType } from '@/types/form';
  
  // Canvas components
  export const FormCanvas: FC<{ className?: string }>;
  export const EmptyCanvas: FC<{ isDraggingOver?: boolean }>;
  export const FormHeader: FC<{
    title: string;
    description: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }>;

  // Field components
  export const Field: FC<{
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
  }>;
  
  export const FieldPreview: FC<{ field: FieldType }>;
  export const FieldSettings: FC<{
    field: FieldType;
    onChange: (updates: Partial<FieldType>) => void;
  }>;
  
  // UI components
  export const TabButton: FC<{
    isActive: boolean;
    onClick: () => void;
    label: string;
  }>;
  
  export const StyleOptionButton: FC<{
    isActive: boolean;
    onClick: () => void;
    label: string;
  }>;
} 