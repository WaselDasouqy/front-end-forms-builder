import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  List, 
  Calendar, 
  Mail, 
  Hash, 
  Phone,
  Upload,
  CreditCard,
  MapPin,
  User,
  Clock,
  Square,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Group field types by category
const fieldTypeCategories = [
  {
    id: 'text-inputs',
    name: 'Text Inputs',
    fields: [
      {
        id: 'short-answer',
        name: 'Short Answer',
        description: 'For brief text responses',
        icon: <Type size={15} className="text-indigo-600" />,
      },
      {
        id: 'long-answer',
        name: 'Long Answer',
        description: 'For detailed text responses',
        icon: <AlignLeft size={15} className="text-indigo-600" />,
      },
      {
        id: 'email',
        name: 'Email',
        description: 'Email address input',
        icon: <Mail size={15} className="text-indigo-600" />,
      },
      {
        id: 'number',
        name: 'Number',
        description: 'Numeric input only',
        icon: <Hash size={15} className="text-indigo-600" />,
      },
      {
        id: 'phone',
        name: 'Phone',
        description: 'Phone number input',
        icon: <Phone size={15} className="text-indigo-600" />,
      },
      {
        id: 'website',
        name: 'Website',
        description: 'URL input field',
        icon: <Upload size={15} className="text-indigo-600" />,
      },
    ]
  },
  {
    id: 'choice-inputs',
    name: 'Choice Inputs',
    fields: [
      {
        id: 'multiple-choice',
        name: 'Multiple Choice',
        description: 'Select one option from many',
        icon: <List size={15} className="text-indigo-600" />,
      },
      {
        id: 'checkbox',
        name: 'Checkboxes',
        description: 'Select multiple options',
        icon: <CheckSquare size={15} className="text-indigo-600" />,
      },
      {
        id: 'dropdown',
        name: 'Dropdown',
        description: 'Select from a dropdown menu',
        icon: <List size={15} className="text-indigo-600" />,
      },
    ]
  },
  {
    id: 'specialized-inputs',
    name: 'Special Fields',
    fields: [
      {
        id: 'date',
        name: 'Date',
        description: 'Date input field',
        icon: <Calendar size={15} className="text-indigo-600" />,
      },
      {
        id: 'file-upload',
        name: 'File Upload',
        description: 'Allow file attachments',
        icon: <Upload size={15} className="text-indigo-600" />,
      },
      {
        id: 'name',
        name: 'Name',
        description: 'Full name input field',
        icon: <User size={15} className="text-indigo-600" />,
      },
      {
        id: 'address',
        name: 'Address',
        description: 'Physical address input',
        icon: <MapPin size={15} className="text-indigo-600" />,
      },
      {
        id: 'section-break',
        name: 'Section Break',
        description: 'Add a section title or divider',
        icon: <Square size={15} className="text-indigo-600" />,
      },
    ]
  }
];

// Flatten all field types for drag and drop
const allFieldTypes = fieldTypeCategories.flatMap(category => category.fields);

interface FieldTypesPanelProps {
  className?: string;
}

const FieldTypesPanel: React.FC<FieldTypesPanelProps> = ({ className = '' }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'text-inputs': true,
    'choice-inputs': true,
    'specialized-inputs': true
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full ${className}`}>
      <div className="p-2 border-b border-gray-200 bg-indigo-50 flex items-center shrink-0">
        <div className="p-1 rounded-md bg-indigo-100 mr-2 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-900">Field Types</h2>
      </div>
      
      <div className="p-1.5 flex-1 overflow-hidden flex flex-col">
        <Droppable droppableId="field-types" isDropDisabled={true}>
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-1 flex-1 overflow-y-auto field-types-container"
            >
              {fieldTypeCategories.map((category, categoryIndex) => (
                <div key={category.id} className="mb-1 last:mb-0">
                  <div 
                    className="flex items-center justify-between py-0.5 px-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    {expandedCategories[category.id] ? 
                      <ChevronDown size={14} className="text-gray-400" /> : 
                      <ChevronRight size={14} className="text-gray-400" />
                    }
                  </div>
                  
                  {expandedCategories[category.id] && (
                    <div className="mt-1 space-y-1">
                      {category.fields.map((fieldType, index) => {
                        // Calculate the global index for draggable
                        const globalIndex = allFieldTypes.findIndex(f => f.id === fieldType.id);
                        
                        return (
                          <Draggable 
                            key={fieldType.id} 
                            draggableId={`field-type-${fieldType.id}`} 
                            index={globalIndex}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  flex items-center p-1.5 rounded-md border text-xs
                                  transition-all duration-200 cursor-grab active:cursor-grabbing
                                  ${snapshot.isDragging 
                                    ? 'border-indigo-400 bg-indigo-50 shadow-md scale-105 z-10' 
                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                                  }
                                `}
                              >
                                <div className="flex-shrink-0 mr-2">
                                  {fieldType.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 truncate">{fieldType.name}</h3>
                                  <p className="text-xs text-gray-500 line-clamp-1">{fieldType.description}</p>
                                </div>
                                {snapshot.isDragging && (
                                  <div className="absolute inset-0 bg-indigo-50 bg-opacity-50 rounded-md flex items-center justify-center pointer-events-none">
                                    <span className="text-xs font-medium text-indigo-600">Drag to form</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      
      <div className="p-1.5 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 italic shrink-0">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Drag fields to the form canvas</span>
        </div>
      </div>
    </div>
  );
};

export default FieldTypesPanel; 