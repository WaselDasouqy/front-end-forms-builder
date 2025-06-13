import React from 'react';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { Pencil, Trash2 } from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';

interface FormCanvasProps {
  className?: string;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({ className = '' }) => {
  const { formData, activeFieldId, setFormData, setActiveFieldId, removeField } = useFormBuilder();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleRemoveField = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeField(fieldId);
  };

  // Debug log to see what fields are currently in state
  console.log('Form data fields:', formData.fields);

  return (
    <div className={`form-canvas p-6 rounded-lg bg-white shadow-sm ${className}`}>
      <div className="mb-6 border-b border-gray-200 pb-5">
        <div className="mb-4">
          <label htmlFor="form-title" className="block text-sm font-medium text-gray-700 mb-1">
            Form Title
          </label>
          <input
            id="form-title"
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Enter form title"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="form-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="form-description"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter form description"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <Droppable droppableId="form-canvas">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`min-h-[200px] transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg p-4' : ''
            }`}
          >
            {formData.fields.length > 0 ? (
              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    onClick={() => setActiveFieldId(field.id)}
                    className={`form-builder-field p-4 rounded-md cursor-pointer border ${
                      activeFieldId === field.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-gray-900 font-medium">{field.label}</h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                          aria-label="Edit field"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleRemoveField(field.id, e)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          aria-label="Remove field"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {field.description && (
                      <p className="text-sm text-gray-500 mt-1 mb-2">{field.description}</p>
                    )}
                    
                    {/* Render appropriate field preview based on type */}
                    <div className="mt-2">
                      {field.type === 'short-answer' && (
                        <input
                          type="text"
                          disabled
                          placeholder={field.placeholder || 'Text input'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                        />
                      )}
                      {field.type === 'long-answer' && (
                        <textarea
                          disabled
                          placeholder={field.placeholder || 'Long text input'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                          rows={2}
                        />
                      )}
                      {field.type === 'checkbox' && (
                        <div className="space-y-2">
                          {(field.options || []).map((option, i) => (
                            <div key={option.id} className="flex items-center">
                              <input 
                                type="checkbox" 
                                disabled 
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2" 
                              />
                              <span className="text-gray-700">{option.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === 'dropdown' && (
                        <select 
                          disabled
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                        >
                          <option>Select an option</option>
                          {(field.options || []).map((option) => (
                            <option key={option.id}>{option.value}</option>
                          ))}
                        </select>
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          disabled
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                        />
                      )}
                      {field.type === 'email' && (
                        <input
                          type="email"
                          disabled
                          placeholder={field.placeholder || 'email@example.com'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          disabled
                          placeholder={field.placeholder || '0'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                        />
                      )}
                      {field.type === 'phone' && (
                        <input
                          type="tel"
                          disabled
                          placeholder={field.placeholder || '(123) 456-7890'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                        />
                      )}
                      {field.type === 'file-upload' && (
                        <div className="w-full border border-gray-300 rounded-md px-3 py-6 bg-gray-50 text-gray-500 text-center">
                          File Upload Area
                        </div>
                      )}
                    </div>
                    
                    {field.required && (
                      <div className="mt-2">
                        <span className="text-xs text-red-500 font-medium">* Required</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`form-canvas-empty text-center py-12 border-2 border-dashed ${
                snapshot.isDraggingOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'
              } rounded-lg transition-colors duration-200`}>
                <div className="text-gray-500">
                  <p className="text-lg font-medium mb-2">Drag and drop field types here</p>
                  <p className="text-sm">Add form fields from the sidebar to build your form</p>
                </div>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}; 