import React, { useState, useRef, useEffect } from 'react';
import { useFormStore } from "@/lib/formStore";
import { Field } from "@/types/form";

interface PreviewPanelProps {
  className?: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ className = '' }) => {
  const { currentForm } = useFormStore();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState<number | null>(null);

  // Auto-resize textareas when content changes
  useEffect(() => {
    Object.entries(textareaRefs.current).forEach(([fieldId, textarea]) => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, [formValues]);

  // Setup the resizable panel
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (resizeHandleRef.current?.contains(e.target as Node)) {
        setIsResizing(true);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !previewRef.current) return;
      
      // Calculate the new width based on mouse position
      const containerRect = previewRef.current.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      const newWidth = containerRect.right - e.clientX;
      // Limit the min and max width
      const limitedWidth = Math.max(200, Math.min(600, newWidth));
      setWidth(limitedWidth);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isResizing]);

  if (!currentForm) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No form to preview</p>
      </div>
    );
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Resize textarea after input
    setTimeout(() => {
      const textarea = textareaRefs.current[fieldId];
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', formValues);
    alert('Form submitted successfully!');
  };

  const getFieldStyles = (field: Field) => {
    const styles: Record<string, string> = {};
    const appearance = field.appearance || {};
    
    if (appearance.fieldBackgroundColor) {
      styles.backgroundColor = appearance.fieldBackgroundColor;
    }
    
    if (appearance.fieldBorderColor) {
      styles.borderColor = appearance.fieldBorderColor;
    }
    
    if (appearance.fieldTextColor) {
      styles.color = appearance.fieldTextColor;
    }
    
    if (appearance.alignment) {
      styles.textAlign = appearance.alignment;
    }
    
    if (appearance.fontWeight === 'bold') {
      styles.fontWeight = 'bold';
    }
    
    if (appearance.fontStyle === 'italic') {
      styles.fontStyle = 'italic';
    }
    
    // Apply border radius
    if (appearance.borderRadius) {
      switch(appearance.borderRadius) {
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
    
    // Add transition effect if animations are enabled
    if (currentForm.settings?.theme?.animationsEnabled) {
      styles.transition = 'all 0.3s ease';
    }
    
    return styles;
  };

  const getLabelStyles = (field: Field) => {
    const styles: Record<string, string> = {};
    const appearance = field.appearance || {};
    
    if (appearance.labelColor) {
      styles.color = appearance.labelColor;
    } else if (appearance.fieldTextColor) {
      // Apply field text color to label if label color not set
      styles.color = appearance.fieldTextColor;
    }
    
    if (appearance.labelFontSize) {
      switch(appearance.labelFontSize) {
        case 'small':
          styles.fontSize = '0.875rem';
          break;
        case 'large':
          styles.fontSize = '1.25rem';
          break;
        default:
          styles.fontSize = '1rem';
      }
    }
    
    if (appearance.labelPosition === 'left') {
      styles.display = 'inline-block';
      styles.marginRight = '1rem';
    }
    
    // Add transition effect if animations are enabled
    if (currentForm.settings?.theme?.animationsEnabled) {
      styles.transition = 'all 0.3s ease';
    }
    
    return styles;
  };

  const getFieldContainerClass = (field: Field) => {
    const appearance = field.appearance || {};
    const classes = ['space-y-2'];
    
    if (appearance.width) {
      switch(appearance.width) {
        case 'half':
          classes.push('md:w-1/2');
          break;
        case 'third':
          classes.push('md:w-1/3');
          break;
        case 'quarter':
          classes.push('md:w-1/4');
          break;
        default:
          classes.push('w-full');
      }
    } else {
      classes.push('w-full');
    }
    
    if (appearance.customCssClasses) {
      classes.push(appearance.customCssClasses);
    }
    
    return classes.join(' ');
  };

  const getFieldSizeClass = (field: Field) => {
    const fieldSize = field.appearance?.fieldSize || 'medium';
    
    switch(fieldSize) {
      case 'small':
        return 'p-1 text-sm';
      case 'large':
        return 'p-3 text-lg';
      default:
        return 'p-2';
    }
  };

  // Get preview panel background style based on theme settings
  const getPreviewBackgroundStyle = () => {
    const theme = currentForm.settings?.theme;
    if (!theme) return {};

    const styles: React.CSSProperties = {
      backgroundColor: theme.backgroundColor || '#ffffff',
      transition: theme.animationsEnabled ? 'all 0.3s ease' : undefined
    };

    // Apply pattern if selected
    if (theme.patternType && theme.patternType !== 'none') {
      const patternOpacity = theme.patternOpacity || 0.1;
      
      switch (theme.patternType) {
        case 'dots':
          styles.backgroundImage = `radial-gradient(${theme.mode === 'dark' ? '#ffffff33' : '#00000011'} 1px, transparent 0)`;
          styles.backgroundSize = '20px 20px';
          break;
        case 'grid':
          styles.backgroundImage = `linear-gradient(to right, ${theme.mode === 'dark' ? '#ffffff22' : '#00000011'} 1px, transparent 1px), 
                                    linear-gradient(to bottom, ${theme.mode === 'dark' ? '#ffffff22' : '#00000011'} 1px, transparent 1px)`;
          styles.backgroundSize = '20px 20px';
          break;
        case 'waves':
          // Subtle wave pattern using a CSS gradient
          const waveColor = theme.mode === 'dark' ? `rgba(255,255,255,${patternOpacity})` : `rgba(0,0,0,${patternOpacity})`;
          styles.backgroundImage = `linear-gradient(to right, ${waveColor} 0%, transparent 25%, transparent 75%, ${waveColor} 100%)`;
          styles.backgroundSize = '50px 100%';
          break;
        case 'geometric':
          // Triangle pattern
          const geoColor = theme.mode === 'dark' ? `rgba(255,255,255,${patternOpacity})` : `rgba(0,0,0,${patternOpacity})`;
          styles.backgroundImage = `linear-gradient(45deg, ${geoColor} 25%, transparent 25%), 
                                   linear-gradient(-45deg, ${geoColor} 25%, transparent 25%)`;
          styles.backgroundSize = '40px 40px';
          break;
      }
    }

    // Apply dark mode adjustments
    if (theme.mode === 'dark') {
      styles.color = '#ffffff';
      styles.backgroundColor = theme.backgroundColor || '#1f2937';
    } else if (theme.mode === 'colorful') {
      // For colorful mode, we'll use a subtle gradient background
      styles.backgroundImage = `linear-gradient(135deg, ${theme.backgroundColor || '#f0fdfa'} 0%, #fae8ff 100%)`;
    }

    return styles;
  };

  // Add colorful mode classes to form elements
  const getColorfulModeClasses = () => {
    const theme = currentForm.settings?.theme;
    if (!theme || theme.mode !== 'colorful') return '';
    
    return 'colorful-mode';
  };

  const renderField = (field: Field) => {
    if (field.isHidden) return null;
    
    // Get field styles
    const fieldStyles = getFieldStyles(field);
    
    switch (field.type) {
      case "short-answer":
        return (
          <input
            type="text"
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            placeholder={field.placeholder || field.label}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyles}
          />
        );
      case "long-answer":
        return (
          <textarea
            ref={(el) => {
              textareaRefs.current[field.id] = el;
            }}
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            rows={3}
            placeholder={field.placeholder || field.label}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={{
              ...fieldStyles,
              resize: 'none',
              overflow: 'hidden',
              minHeight: '80px'
            }}
          />
        );
      case "multiple-choice":
        return field.options && field.options.length > 0 ? (
          <div className={`space-y-2 ${field.displayAsInlineList ? 'flex flex-wrap gap-x-6' : ''}`}>
            {field.options.map((option, index) => (
              <div key={option.id} className={`flex items-center ${field.displayAsInlineList ? 'mr-4' : ''}`}>
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  id={`option-${field.id}-${index}`}
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 ${getColorfulModeClasses()}`}
                  checked={formValues[field.id] === option.value}
                  onChange={(e) => handleInputChange(field.id, option.value)}
                />
                <label 
                  htmlFor={`option-${field.id}-${index}`} 
                  className="ml-2 text-sm" 
                  style={fieldStyles}
                >
                  {option.value}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No options added</p>
        );
      case "checkbox":
        return field.options && field.options.length > 0 ? (
          <div className={`space-y-2 ${field.displayAsInlineList ? 'flex flex-wrap gap-x-6' : ''}`}>
            {field.options.map((option, index) => (
              <div key={option.id} className={`flex items-center ${field.displayAsInlineList ? 'mr-4' : ''}`}>
                <input
                  type="checkbox"
                  id={`option-${field.id}-${index}`}
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${getColorfulModeClasses()}`}
                  checked={Array.isArray(formValues[field.id]) && formValues[field.id].includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(formValues[field.id]) ? [...formValues[field.id]] : [];
                    if (e.target.checked) {
                      handleInputChange(field.id, [...currentValues, option.value]);
                    } else {
                      handleInputChange(field.id, currentValues.filter(v => v !== option.value));
                    }
                  }}
                />
                <label 
                  htmlFor={`option-${field.id}-${index}`} 
                  className="ml-2 text-sm" 
                  style={fieldStyles}
                >
                  {option.value}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No options added</p>
        );
      case "dropdown":
        return (
          <select
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyles}
          >
            {!field.allowMultipleSelections && <option value="">Select an option</option>}
            {field.options?.map((option) => (
              <option key={option.id} value={option.id.toString()} style={fieldStyles}>
                {option.value}
              </option>
            ))}
          </select>
        );
      case "rating":
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: field.maxRating || 5 }).map((_, index) => (
              <span key={index} className={`text-2xl text-gray-300 cursor-pointer ${getColorfulModeClasses()}`} style={fieldStyles}>
                {field.ratingIcon === 'heart' ? '❤️' : 
                 field.ratingIcon === 'thumbs-up' ? '👍' : 
                 field.ratingIcon === 'number' ? (index + 1) : '★'}
              </span>
            ))}
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyles}
          />
        );
      case "email":
        return (
          <input
            type="email"
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            placeholder={field.placeholder || "email@example.com"}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyles}
          />
        );
      case "number":
        return (
          <input
            type="number"
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            placeholder={field.placeholder || "0"}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyles}
          />
        );
      case "phone":
        return (
          <input
            type="tel"
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            placeholder={field.placeholder || "(123) 456-7890"}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyles}
          />
        );
      case "website":
        return (
          <input
            type="url"
            className={`w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            placeholder={field.placeholder || "https://example.com"}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyles}
          />
        );
      case "file-upload":
        return (
          <div 
            className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${getFieldSizeClass(field)} ${getColorfulModeClasses()}`}
            style={fieldStyles}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3" style={{color: fieldStyles.color || "#6b7280"}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm" style={{color: fieldStyles.color || "#6b7280"}}>
                {field.allowedFileTypes ? `Upload ${field.allowedFileTypes.join(', ')} files` : 'Upload files'}
              </p>
            </div>
            <input type="file" className="hidden" />
          </div>
        );
      case "section-break":
        return (
          <div className="py-2 border-b border-gray-200">
            <h3 className="text-lg font-medium" style={fieldStyles}>
              {field.sectionTitle || field.label}
            </h3>
            {field.description && (
              <p className="mt-1 text-sm text-gray-500">{field.description}</p>
            )}
          </div>
        );
      default:
        return <p>Unknown field type</p>;
    }
  };
  
  // Get theme-based classes for the submit button
  const getSubmitButtonClasses = () => {
    const theme = currentForm.settings?.theme;
    let classes = 'w-full sm:w-auto px-6 py-3 text-white font-medium rounded-md shadow-sm transition-colors duration-200 ';
    
    if (theme?.mode === 'dark') {
      classes += 'bg-indigo-500 hover:bg-indigo-400';
    } else if (theme?.mode === 'colorful') {
      classes += 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600';
    } else {
      classes += 'bg-indigo-600 hover:bg-indigo-700';
    }
    
    return classes;
  };

  return (
    <div 
      ref={previewRef}
      className={`relative bg-white rounded-lg shadow-sm border border-gray-200 h-full ${className} overflow-hidden`}
      style={width ? { width: `${width}px` } : {}}
    >
      {/* Resize handle */}
      <div 
        ref={resizeHandleRef}
        className="absolute left-0 top-0 h-full w-1 cursor-w-resize bg-transparent hover:bg-indigo-300 z-10"
        title="Drag to resize"
      />

      <div className="p-2 border-b border-gray-200 bg-indigo-50 flex items-center">
        <div className="p-1 rounded-md bg-indigo-100 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-900">Form Preview</h2>
      </div>
      
      <div 
        className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto"
        style={getPreviewBackgroundStyle()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h1 
              className="text-2xl font-bold"
              style={{ 
                color: currentForm.settings?.theme?.mode === 'dark' ? '#ffffff' : '#111827',
                transition: currentForm.settings?.theme?.animationsEnabled ? 'all 0.3s ease' : undefined
              }}
            >
              {currentForm.title || 'Untitled Form'}
            </h1>
            {currentForm.description && (
              <p 
                className="mt-2"
                style={{ 
                  color: currentForm.settings?.theme?.mode === 'dark' ? '#d1d5db' : '#4b5563',
                  transition: currentForm.settings?.theme?.animationsEnabled ? 'all 0.3s ease' : undefined
                }}
              >
                {currentForm.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap -mx-2">
            {currentForm.fields.map((field) => (
              <div key={field.id} className={`${getFieldContainerClass(field)} px-2 mb-4`}>
                {field.appearance?.labelPosition !== 'hidden' && field.type !== 'section-break' && (
                  <label 
                    className="block font-medium text-gray-800" 
                    style={{
                      ...getLabelStyles(field),
                      color: currentForm.settings?.theme?.mode === 'dark' 
                        ? (field.appearance?.labelColor || '#ffffff') 
                        : (field.appearance?.labelColor || '#1f2937')
                    }}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {field.description && field.appearance?.descriptionPosition !== 'below-field' && field.type !== 'section-break' && (
                  <p 
                    className="text-sm mb-1"
                    style={{ 
                      color: currentForm.settings?.theme?.mode === 'dark' ? '#9ca3af' : '#6b7280',
                      transition: currentForm.settings?.theme?.animationsEnabled ? 'all 0.3s ease' : undefined
                    }}
                  >
                    {field.description}
                  </p>
                )}
                {renderField(field)}
                {field.description && field.appearance?.descriptionPosition === 'below-field' && field.type !== 'section-break' && (
                  <p 
                    className="text-xs mt-1"
                    style={{ 
                      color: currentForm.settings?.theme?.mode === 'dark' ? '#9ca3af' : '#6b7280',
                      transition: currentForm.settings?.theme?.animationsEnabled ? 'all 0.3s ease' : undefined
                    }}
                  >
                    {field.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {currentForm.fields.length > 0 && (
            <div className="pt-4">
              <button
                type="submit"
                className={getSubmitButtonClasses()}
                style={{
                  transition: currentForm.settings?.theme?.animationsEnabled ? 'all 0.3s ease' : undefined
                }}
              >
                {currentForm.settings?.submitButtonText || 'Submit'}
              </button>
            </div>
          )}
        </form>
      </div>
      
      {/* Add some CSS for the colorful mode styling */}
      <style jsx global>{`
        .colorful-mode input[type="text"],
        .colorful-mode input[type="email"],
        .colorful-mode input[type="number"],
        .colorful-mode input[type="tel"],
        .colorful-mode input[type="url"],
        .colorful-mode input[type="date"],
        .colorful-mode textarea,
        .colorful-mode select {
          border-color: #d1d5db;
          border-width: 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .colorful-mode input:focus,
        .colorful-mode textarea:focus,
        .colorful-mode select:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
          outline: none;
        }
        
        .colorful-mode input[type="radio"],
        .colorful-mode input[type="checkbox"] {
          color: #ec4899;
        }
      `}</style>
    </div>
  );
};

export default PreviewPanel; 