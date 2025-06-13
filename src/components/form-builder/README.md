# Form Builder Components

This directory contains the refactored form builder components, organized into smaller, more maintainable pieces.

## Directory Structure

```
form-builder/
├── canvas/              # Canvas-related components
│   ├── EmptyCanvas.tsx  # Empty state when no fields are present
│   ├── FormCanvas.tsx   # Main canvas component
│   └── FormHeader.tsx   # Form title and description
├── fields/              # Field-related components
│   ├── AppearanceSettings.tsx  # Appearance settings tab
│   ├── BasicSettings.tsx       # Basic settings tab
│   ├── Field.tsx               # Field container component
│   ├── FieldPreview.tsx        # Field preview rendering
│   ├── FieldSettings.tsx       # Settings panel for fields
│   ├── OptionItem.tsx          # Option item for multi-select fields
│   ├── StyleOptionButton.tsx   # Button for style options
│   └── TabButton.tsx           # Tab navigation button
└── index.ts             # Exports all components
```

## Usage

Import components from the form-builder module:

```tsx
import { FormCanvas, Field, FieldSettings } from '@/components/form-builder';
```

## Component Responsibilities

- **FormCanvas**: Main container for the form builder
- **Field**: Displays a single form field with controls
- **FieldSettings**: Settings panel for configuring a field
- **FieldPreview**: Renders the preview of different field types
- **EmptyCanvas**: Shown when the form has no fields
- **FormHeader**: Title and description inputs for the form

## Migration from Old Components

The previous builder components are now deprecated. Please use the new form-builder components instead. 