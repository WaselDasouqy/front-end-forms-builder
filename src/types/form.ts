export type FieldType = 
  | 'short-answer'
  | 'long-answer'
  | 'multiple-choice'
  | 'checkbox'
  | 'dropdown'
  | 'rating'
  | 'date'
  | 'email'
  | 'phone'
  | 'number'
  | 'website'
  | 'file-upload'
  | 'section-break'
  | 'name'
  | 'address'
  | 'likert'
  | 'signature'
  | 'time';

export interface FieldOption {
  id: string;
  value: string;
  description?: string;
  // For multiple choice and checkbox fields
  hasOtherOption?: boolean;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  customErrorMessage?: string;
}

export interface FieldAppearance {
  labelPosition?: 'top' | 'left' | 'hidden';
  labelFontSize?: 'small' | 'medium' | 'large';
  fieldSize?: 'small' | 'medium' | 'large';
  width?: 'full' | 'half' | 'third' | 'quarter';
  labelColor?: string;
  fieldBackgroundColor?: string;
  fieldBorderColor?: string;
  fieldTextColor?: string;
  customCssClasses?: string;
  iconPosition?: 'left' | 'right' | 'none';
  iconPrefix?: string; // Font awesome or other icon class
  alignment?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'medium' | 'bold';
  fontStyle?: 'normal' | 'italic';
  borderRadius?: 'none' | 'default' | 'rounded' | 'pill';
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderWidth?: string;
  animation?: 'none' | 'fade' | 'slide' | 'bounce';
  customCss?: string;
  descriptionPosition?: 'below-label' | 'below-field';
}

export interface FieldLogic {
  visibleWhen?: {
    fieldId: string;
    condition: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than';
    value: string;
  }[];
  requiredWhen?: {
    fieldId: string;
    condition: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than';
    value: string;
  }[];
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  description?: string;
  placeholder?: string;
  defaultValue?: string | string[] | number;
  options?: FieldOption[];
  appearance?: FieldAppearance;
  validation?: FieldValidation;
  isReadOnly?: boolean;
  isHidden?: boolean;
  helpText?: string;
  dataBindingKey?: string;
  // For dropdown fields
  allowMultipleSelections?: boolean;
  // For multiple choice and checkbox fields
  displayAsInlineList?: boolean;
  // For grid layouts
  columnPosition?: number;
  // For section break
  sectionTitle?: string;
  // For rating
  maxRating?: number;
  ratingIcon?: 'star' | 'heart' | 'thumbs-up' | 'number';
  // For file upload
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
  // Conditional logic
  logic?: FieldLogic;
}

export interface FormLayout {
  template?: string;
  columns?: number;
  logoUrl?: string;
  headerBackgroundColor?: string;
  footerContent?: string;
  submitButtonPosition?: 'left' | 'center' | 'right';
  submitButtonColor?: string;
  submitButtonTextColor?: string;
  submitButtonBorderRadius?: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  author?: string;
  fields: Field[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  layout?: FormLayout;
  settings: FormSettings;
  responseCount?: number;
}

export interface FormSettings {
  submitButtonText: string;
  showProgressBar: boolean;
  confirmationMessage: string;
  redirectUrl?: string;
  theme?: FormTheme;
  allowMultipleSubmissions?: boolean;
  notifyEmails?: string[];
  enableCaptcha?: boolean;
  autoSaveResponses?: boolean;
  limitSubmissions?: number;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  mode: 'light' | 'dark' | 'colorful';
  patternType?: 'none' | 'dots' | 'waves' | 'grid' | 'geometric';
  patternOpacity?: number;
  animationsEnabled?: boolean;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  spacing?: 'compact' | 'normal' | 'spacious';
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'pill';
}

export interface FormStats {
  totalForms: number;
  totalFields: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  createdAt: Date;
  data: Record<string, any>;
} 