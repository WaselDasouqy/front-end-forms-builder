import React, { memo } from 'react';

interface FormHeaderProps {
  title: string;
  description: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormHeader = memo(({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}: FormHeaderProps) => {
  return (
    <div className="p-2 border-b border-gray-200 bg-white shrink-0">
      <div className="mb-1.5">
        <label htmlFor="form-title" className="block text-xs font-medium text-gray-700 mb-1">
          Form Title
        </label>
        <input
          id="form-title"
          type="text"
          value={title}
          onChange={onTitleChange}
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
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter form description"
          rows={2}
          className="w-full px-2.5 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>
    </div>
  );
});

FormHeader.displayName = 'FormHeader';

export default FormHeader; 