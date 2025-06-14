// Empty placeholder file
export interface Form {
  id: string;
  title?: string;
}

export interface FormStore {
  forms: Form[];
  loadUserForms: () => Promise<void>;
}

export function useFormStore(): FormStore {
  return {
    forms: [],
    loadUserForms: async () => {}
  };
}
