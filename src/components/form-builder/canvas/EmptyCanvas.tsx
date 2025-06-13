import React, { memo } from 'react';

interface EmptyCanvasProps {
  isDraggingOver?: boolean;
}

const EmptyCanvas = memo(({ isDraggingOver }: EmptyCanvasProps) => {
  if (isDraggingOver) {
    return (
      <div className="border-2 border-dashed rounded-lg p-4 text-center h-full border-indigo-300 bg-indigo-50 transition-colors duration-200">
        <p className="text-indigo-500 font-medium">Drop your field here</p>
      </div>
    );
  }

  return (
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
  );
});

EmptyCanvas.displayName = 'EmptyCanvas';

export default EmptyCanvas; 