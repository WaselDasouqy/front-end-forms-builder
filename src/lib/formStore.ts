import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Form, Field, FieldOption, FormTheme, FormSettings } from '../types/form';
import { nanoid } from 'nanoid';
import { forms } from './api';

export interface FormState {
  forms: Form[];
  currentForm: Form | null;
  
  // Actions
  createNewForm: () => void;
  updateCurrentForm: (updates: Partial<Form>) => void;
  updateForm: (updates: Partial<Form>) => void;
  addField: (field: Omit<Field, 'id'>, addToTop?: boolean) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  removeField: (fieldId: string) => void;
  deleteField: (fieldId: string) => void;
  duplicateField: (fieldId: string) => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;
  saveForm: () => Promise<void>;
  loadForm: (formId: string) => Promise<void>;
  loadUserForms: () => Promise<void>;
  getFormById: (formId: string) => Form | undefined;
  duplicateForm: (formId: string) => void;
  updateFormTheme: (themeUpdates: Partial<FormTheme>) => void;
  updateFormSettings: (settingsUpdates: Partial<FormSettings>) => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      forms: [],
      currentForm: null,

      createNewForm: () => {
        const newForm: Form = {
          id: nanoid(),
          title: 'Untitled Form',
          description: '',
          fields: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: false,
          settings: {
            submitButtonText: 'Submit',
            showProgressBar: false,
            confirmationMessage: 'Thank you for your submission!',
            theme: {
              primaryColor: '#4f46e5',
              backgroundColor: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              mode: 'light',
              patternType: 'none',
              patternOpacity: 0.1,
              animationsEnabled: true,
              borderStyle: 'solid',
              cardShadow: 'sm',
              spacing: 'normal',
              borderRadius: 'medium'
            }
          }
        };
        set({ currentForm: newForm });
      },

      updateCurrentForm: (updates: Partial<Form>) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          return {
            currentForm: {
              ...state.currentForm,
              ...updates,
              updatedAt: new Date()
            }
          };
        });
      },

      updateForm: (updates: Partial<Form>) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          return {
            currentForm: {
              ...state.currentForm,
              ...updates,
              updatedAt: new Date()
            }
          };
        });
      },

      addField: (field: Omit<Field, 'id'>, addToTop = false) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          const newField: Field = {
            id: nanoid(),
            ...field,
          };
          
          return {
            currentForm: {
              ...state.currentForm,
              fields: addToTop 
                ? [newField, ...state.currentForm.fields]
                : [...state.currentForm.fields, newField],
              updatedAt: new Date()
            },
          };
        });
      },

      updateField: (fieldId: string, updates: Partial<Field>) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          const updatedFields = state.currentForm.fields.map((field) => {
            if (field.id === fieldId) {
              const updatedField = { ...field };
              
              // Handle top-level properties
              Object.keys(updates).forEach(key => {
                if (key !== 'appearance' && key !== 'validation' && key !== 'options' && key !== 'logic') {
                  // Use type assertion to avoid type errors
                  (updatedField as any)[key] = updates[key as keyof Field];
                }
              });
              
              // Handle nested appearance properties
              if (updates.appearance) {
                updatedField.appearance = {
                  ...(updatedField.appearance || {}),
                  ...updates.appearance
                };
              }
              
              // Handle nested validation properties
              if (updates.validation) {
                updatedField.validation = {
                  ...(updatedField.validation || {}),
                  ...updates.validation
                };
              }
              
              // Handle nested options array
              if (updates.options) {
                updatedField.options = [...updates.options];
              }
              
              // Handle nested logic properties
              if (updates.logic) {
                updatedField.logic = {
                  ...(updatedField.logic || {}),
                  ...updates.logic
                };
              }
              
              return updatedField;
            }
            return field;
          });
          
          return {
            currentForm: {
              ...state.currentForm,
              fields: updatedFields,
              updatedAt: new Date()
            },
          };
        });
      },

      removeField: (fieldId: string) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          const updatedFields = state.currentForm.fields.filter(
            (field) => field.id !== fieldId
          );
          
          return {
            currentForm: {
              ...state.currentForm,
              fields: updatedFields,
              updatedAt: new Date()
            },
          };
        });
      },

      deleteField: (fieldId: string) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          const updatedFields = state.currentForm.fields.filter(
            (field) => field.id !== fieldId
          );
          
          return {
            currentForm: {
              ...state.currentForm,
              fields: updatedFields,
              updatedAt: new Date()
            },
          };
        });
      },

      duplicateField: (fieldId: string) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          const fieldToDuplicate = state.currentForm.fields.find(f => f.id === fieldId);
          if (!fieldToDuplicate) return state;
          
          const fieldIndex = state.currentForm.fields.findIndex(f => f.id === fieldId);
          
          // Create a deep copy of the field and assign a new ID
          const duplicatedField: Field = {
            ...JSON.parse(JSON.stringify(fieldToDuplicate)),
            id: nanoid(),
            label: `${fieldToDuplicate.label} (Copy)`
          };
          
          // Deep copy options array if it exists
          if (fieldToDuplicate.options) {
            duplicatedField.options = fieldToDuplicate.options.map(option => ({
              ...option,
              id: nanoid()
            }));
          }
          
          // Insert the duplicated field after the original
          const updatedFields = [...state.currentForm.fields];
          updatedFields.splice(fieldIndex + 1, 0, duplicatedField);
          
          return {
            currentForm: {
              ...state.currentForm,
              fields: updatedFields,
              updatedAt: new Date()
            }
          };
        });
      },

      reorderFields: (oldIndex: number, newIndex: number) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          const fields = [...state.currentForm.fields];
          const [removed] = fields.splice(oldIndex, 1);
          fields.splice(newIndex, 0, removed);
          
          return {
            currentForm: {
              ...state.currentForm,
              fields,
              updatedAt: new Date()
            },
          };
        });
      },

      saveForm: async () => {
        const state = get();
        
        if (!state.currentForm) return;
        
        // Create a deep clone outside the setState callback
        const updatedForm = {
          ...state.currentForm,
          updatedAt: new Date()
        };
        
        // Deep clone the form to ensure all nested properties are properly saved
        const deepClonedForm = JSON.parse(JSON.stringify(updatedForm));
        
        try {
          let savedForm;
          // Check if form already exists (update) or is new (create)
          const exists = state.forms.some((form) => form.id === deepClonedForm.id);
          
          if (exists) {
            savedForm = await forms.updateForm(deepClonedForm.id, deepClonedForm);
          } else {
            savedForm = await forms.createForm(deepClonedForm);
          }
          
          set((state: FormState) => {
            let updatedForms;
            if (exists) {
              updatedForms = state.forms.map((form) =>
                form.id === savedForm.id ? savedForm : form
              );
            } else {
              updatedForms = [...state.forms, savedForm];
            }
            
            return { 
              forms: updatedForms,
              currentForm: savedForm
            };
          });
        } catch (error) {
          console.error('Error saving form:', error);
          throw error;
        }
      },

      loadForm: async (formId: string) => {
        try {
          const form = await forms.getFormById(formId);
          set((state: FormState) => {
            return { currentForm: form };
          });
        } catch (error) {
          console.error('Error loading form:', error);
          // Fallback to local storage
          set((state: FormState) => {
            const form = state.forms.find((f) => f.id === formId);
            return { currentForm: form ? { ...form } : null };
          });
        }
      },

      loadUserForms: async () => {
        try {
          const userForms = await forms.getUserForms();
          set((state: FormState) => {
            return { forms: userForms };
          });
        } catch (error) {
          console.error('Error loading user forms:', error);
          throw error;
        }
      },

      getFormById: (formId: string) => {
        return get().forms.find((form) => form.id === formId);
      },
      
      duplicateForm: (formId: string) => {
        const form = get().forms.find((f) => f.id === formId);
        if (!form) return;
        
        const newForm: Form = {
          ...form,
          id: nanoid(),
          title: `${form.title} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date(),
          fields: form.fields.map(field => ({
            ...field,
            id: nanoid(),
            options: field.options ? field.options.map(opt => ({
              ...opt,
              id: nanoid()
            })) : undefined
          }))
        };
        
        set((state: FormState) => ({
          forms: [...state.forms, newForm],
          currentForm: newForm
        }));
      },

      updateFormTheme: (themeUpdates: Partial<FormTheme>) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          // Ensure settings and theme exist
          const currentSettings = state.currentForm.settings || {
            submitButtonText: 'Submit',
            showProgressBar: false,
            confirmationMessage: 'Thank you for your submission!',
          };
          
          const currentTheme = currentSettings.theme || {
            primaryColor: '#4f46e5',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            mode: 'light'
          };
          
          return {
            currentForm: {
              ...state.currentForm,
              settings: {
                ...currentSettings,
                theme: {
                  ...currentTheme,
                  ...themeUpdates
                }
              },
              updatedAt: new Date()
            }
          };
        });
      },

      updateFormSettings: (settingsUpdates: Partial<FormSettings>) => {
        set((state: FormState) => {
          if (!state.currentForm) return state;
          
          const currentSettings = state.currentForm.settings || {
            submitButtonText: 'Submit',
            showProgressBar: false,
            confirmationMessage: 'Thank you for your submission!',
          };
          
          return {
            currentForm: {
              ...state.currentForm,
              settings: {
                ...currentSettings,
                ...settingsUpdates
              },
              updatedAt: new Date()
            }
          };
        });
      }
    }),
    {
      name: 'formwave-storage',
    }
  )
); 