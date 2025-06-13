import React from 'react';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  List, 
  Calendar, 
  Mail, 
  Hash, 
  Phone,
  Upload
} from 'lucide-react';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface FieldTypeProps {
  className?: string;
}

const fieldTypesList = [
  { 
    id: 'text',
    name: 'Short Answer',
    description: 'For brief text responses',
    icon: <Type className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'textarea',
    name: 'Long Answer',
    description: 'For detailed text responses',
    icon: <AlignLeft className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'checkbox',
    name: 'Checkboxes',
    description: 'Select multiple options',
    icon: <CheckSquare className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'select',
    name: 'Dropdown',
    description: 'Select from a dropdown menu',
    icon: <List className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'date',
    name: 'Date',
    description: 'Date selector',
    icon: <Calendar className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'email',
    name: 'Email',
    description: 'Email address input',
    icon: <Mail className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'number',
    name: 'Number',
    description: 'Numeric input',
    icon: <Hash className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'tel',
    name: 'Phone',
    description: 'Phone number input',
    icon: <Phone className="w-5 h-5 text-indigo-600" />,
  },
  { 
    id: 'file',
    name: 'File Upload',
    description: 'File upload field',
    icon: <Upload className="w-5 h-5 text-indigo-600" />,
  },
];

export const FieldTypes: React.FC<FieldTypeProps> = ({ className = '' }) => {
  const { addField } = useFormBuilder();

  return (
    <div className={`bg-white p-5 rounded-lg shadow-sm ${className}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Field Types</h2>
      <Droppable droppableId="field-types" isDropDisabled={true}>
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {fieldTypesList.map((fieldType, index) => (
              <Draggable 
                key={fieldType.id} 
                draggableId={`field-type-${fieldType.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`field-type-item rounded-md 
                      ${snapshot.isDragging ? 'border-indigo-500 bg-indigo-50 opacity-70' : 'hover:bg-indigo-50'}`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {fieldType.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{fieldType.name}</h3>
                        <p className="text-xs text-gray-500">{fieldType.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}; 