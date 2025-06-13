"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormStore } from '@/lib/formStore';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Save, Eye, Grid, Settings, Home, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from "@/lib/authContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthGuard from "@/components/AuthGuard";
import ShareSuccessModal from "@/components/sharing/ShareSuccessModal";

// Dynamic imports for heavy components
const FieldTypesPanel = dynamic(() => import('@/components/builder/FieldTypesPanel'), {
  loading: () => <div className="h-full flex items-center justify-center"><div className="animate-pulse">Loading fields...</div></div>,
  ssr: false
});

const FormCanvas = dynamic(() => import('@/components/builder/FormCanvas'), {
  loading: () => <div className="h-full flex items-center justify-center"><div className="animate-pulse">Loading canvas...</div></div>,
  ssr: false
});

const PreviewPanel = dynamic(() => import('@/components/builder/PreviewPanel'), {
  loading: () => <div className="h-full flex items-center justify-center"><div className="animate-pulse">Loading preview...</div></div>,
  ssr: false
});

const ThemeSwitcher = dynamic(() => import('@/components/builder/ThemeSwitcher'), {
  loading: () => <div className="h-full flex items-center justify-center"><div className="animate-pulse">Loading theme options...</div></div>,
  ssr: false
});

// Simple loading component
const LoadingPanel = () => (
  <div className="h-full flex items-center justify-center">
    <div className="animate-pulse text-indigo-600">Loading...</div>
  </div>
);

function FormBuilderContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get('formId');
  
  const { 
    createNewForm, 
    loadForm, 
    addField, 
    saveForm, 
    currentForm,
  } = useFormStore();
  
  const [mounted, setMounted] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activePanel, setActivePanel] = useState<'types' | 'preview'>('types');
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize the form builder when authenticated
  useEffect(() => {
    if (user) {
      setMounted(true);
      setLoading(false);
    }
  }, [user]);

  // Memoized background style
  const backgroundStyle = useCallback(() => {
    if (!showGrid) return {};
    
    return {
      backgroundImage: 'linear-gradient(to right, #f1f5f980 1px, transparent 1px), linear-gradient(to bottom, #f1f5f980 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0',
    };
  }, [showGrid]);

  // Load form or create new when authenticated and mounted
  useEffect(() => {
    if (!mounted || !user) return;
    
    if (formId) {
      loadForm(formId);
    } else {
      createNewForm();
    }
  }, [formId, loadForm, createNewForm, mounted, user]);

  const handleSave = useCallback(async () => {
    try {
      setSaveIndicator(true);
      await saveForm();
      setTimeout(() => {
        setSaveIndicator(false);
        setShowShareModal(true); // Show sharing modal instead of redirecting
      }, 1000);
    } catch (error) {
      console.error('Error saving form:', error);
      setSaveIndicator(false);
      // You might want to show an error message to the user
    }
  }, [saveForm]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    // Drop was cancelled or dropped outside valid area
    if (!destination) return;

    // Dropping from field types to canvas
    if (source.droppableId === 'field-types' && destination.droppableId === 'form-canvas') {
      // Extract the field type from the draggableId (removing the 'field-type-' prefix)
      const fieldType = result.draggableId.replace('field-type-', '');
      
      // Add field based on type with default settings
      const newField: any = {
        type: fieldType,
        label: getDefaultLabel(fieldType),
        required: false,
        description: '',
      };
      
      // Add default options for select fields
      if (['multiple-choice', 'checkbox', 'dropdown'].includes(fieldType)) {
        newField.options = [
          { id: `option-${Date.now()}-1`, value: 'Option 1' },
          { id: `option-${Date.now()}-2`, value: 'Option 2' },
          { id: `option-${Date.now()}-3`, value: 'Option 3' }
        ];
      }
      
      // Add to the top of the form
      addField(newField, true);
    }
  }, [addField]);

  // Helper to get default label for a field type
  const getDefaultLabel = useCallback((fieldType: string): string => {
    switch (fieldType) {
      case 'short-answer': return 'Short Answer Question';
      case 'long-answer': return 'Long Answer Question';
      case 'multiple-choice': return 'Multiple Choice Question';
      case 'checkbox': return 'Checkbox Question';
      case 'dropdown': return 'Dropdown Question';
      case 'date': return 'Date';
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      case 'number': return 'Number';
      case 'website': return 'Website URL';
      case 'file-upload': return 'File Upload';
      case 'section-break': return 'Section Heading';
      default: return `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Question`;
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Loading form builder...</p>
      </div>
    );
  }

  if (!mounted) return <LoadingPanel />;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col" style={backgroundStyle()}>
        <div className="flex justify-between items-center h-10 px-2 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="h-8 w-8 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              title="Back to Dashboard"
            >
              <Home size={16} />
            </button>
            
            {currentForm && (
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                  {currentForm.title || 'Untitled Form'}
                </span>
                <ChevronDown size={14} className="ml-1 text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className={`h-8 w-8 p-1.5 rounded-md ${showGrid ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
              title="Toggle Grid Background"
            >
              <Grid size={16} />
            </button>
            
            <button 
              onClick={() => setShowThemePanel(!showThemePanel)}
              className={`h-8 w-8 p-1.5 rounded-md ${showThemePanel ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
              title="Theme Settings"
            >
              <Settings size={16} />
            </button>
            
            <button 
              onClick={() => setActivePanel(activePanel === 'types' ? 'preview' : 'types')}
              className="h-8 p-1.5 px-2 ml-1 text-xs flex items-center gap-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {activePanel === 'types' ? (
                <>
                  <Eye size={14} />
                  <span className="hidden sm:inline">Preview</span>
                </>
              ) : (
                <>
                  <Grid size={14} />
                  <span className="hidden sm:inline">Fields</span>
                </>
              )}
            </button>
            
            <button 
              onClick={handleSave}
              className={`h-8 p-1.5 px-2 text-xs flex items-center gap-1 rounded-md text-white font-medium ${
                saveIndicator ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Save size={14} />
              <span>{saveIndicator ? 'Saved!' : 'Save Form'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-1 overflow-hidden">
          {/* Left panel - alternates between field types and preview based on screen size */}
          <div className="lg:col-span-3 order-2 lg:order-1 overflow-hidden flex flex-col">
            <div className={`lg:block h-full ${activePanel === 'preview' ? 'hidden' : 'block'}`}>
              <Suspense fallback={<LoadingPanel />}>
                <FieldTypesPanel className="h-full" />
              </Suspense>
            </div>
            <div className={`lg:hidden h-full ${activePanel === 'types' ? 'hidden' : 'block'}`}>
              <Suspense fallback={<LoadingPanel />}>
                <PreviewPanel className="h-full" />
              </Suspense>
            </div>
          </div>
          
          {/* Center panel - form canvas */}
          <div className="lg:col-span-6 order-1 lg:order-2 overflow-hidden flex flex-col">
            <Suspense fallback={<LoadingPanel />}>
              <FormCanvas className="h-full" />
            </Suspense>
          </div>
          
          {/* Right panel - preview panel or theme panel (desktop only) */}
          <div className="lg:col-span-3 order-3 hidden lg:flex flex-col overflow-hidden">
            {showThemePanel ? (
              <Suspense fallback={<LoadingPanel />}>
                <ThemeSwitcher className="h-full" />
              </Suspense>
            ) : (
              <Suspense fallback={<LoadingPanel />}>
                <PreviewPanel className="h-full" />
              </Suspense>
            )}
          </div>
        </div>
        
        {/* Theme panel toggle button (mobile only) */}
        <div className="fixed bottom-4 right-4 lg:hidden z-20">
          <button
            onClick={() => setShowThemePanel(!showThemePanel)}
            className={`h-10 w-10 rounded-full shadow-md flex items-center justify-center ${
              showThemePanel ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <Settings size={18} />
          </button>
          
          {/* Mobile theme panel */}
          {showThemePanel && (
            <div className="absolute bottom-12 right-0 w-64 mb-2">
              <Suspense fallback={<LoadingPanel />}>
                <ThemeSwitcher />
              </Suspense>
            </div>
          )}
        </div>
      </div>
      {showShareModal && currentForm && (
        <ShareSuccessModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          formId={currentForm.id}
          formTitle={currentForm.title}
        />
      )}
    </DragDropContext>
  );
}

export default function FormBuilderPage() {
  return (
    <AuthGuard requireAuth={true}>
      <FormBuilderContent />
    </AuthGuard>
  );
} 