import React from 'react';
import { useFormStore } from '@/lib/formStore';
import { FormTheme } from '@/types/form';
import { Sun, Moon, Palette, Grid3X3, Waves, CircleDot, TriangleIcon } from 'lucide-react';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { currentForm, updateFormTheme } = useFormStore();
  
  if (!currentForm?.settings?.theme) return null;
  
  const { theme } = currentForm.settings;
  
  const handleThemeChange = (mode: 'light' | 'dark' | 'colorful') => {
    // Get appropriate theme colors based on mode
    const themeColors: Record<'light' | 'dark' | 'colorful', Partial<FormTheme>> = {
      light: {
        primaryColor: '#4f46e5',
        backgroundColor: '#ffffff',
        mode: 'light' as const
      },
      dark: {
        primaryColor: '#818cf8',
        backgroundColor: '#1f2937',
        mode: 'dark' as const
      },
      colorful: {
        primaryColor: '#ec4899',
        backgroundColor: '#f0fdfa',
        mode: 'colorful' as const
      }
    };
    
    updateFormTheme(themeColors[mode]);
  };
  
  const handlePatternChange = (patternType: 'none' | 'dots' | 'waves' | 'grid' | 'geometric') => {
    updateFormTheme({ patternType });
  };
  
  const handleToggleAnimations = () => {
    updateFormTheme({ animationsEnabled: !theme.animationsEnabled });
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col ${className}`}>
      <div className="p-2 border-b border-gray-200 bg-indigo-50 flex items-center">
        <div className="p-1 rounded-md bg-indigo-100 mr-2">
          <Palette size={14} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">Theme</h3>
      </div>
      
      <div className="p-3 space-y-3">
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">Mode</div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 py-1.5 px-2 text-xs rounded-md flex items-center justify-center gap-1
                ${theme.mode === 'light' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              <Sun size={12} />
              <span>Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 py-1.5 px-2 text-xs rounded-md flex items-center justify-center gap-1
                ${theme.mode === 'dark' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              <Moon size={12} />
              <span>Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('colorful')}
              className={`flex-1 py-1.5 px-2 text-xs rounded-md flex items-center justify-center gap-1
                ${theme.mode === 'colorful' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              <Palette size={12} />
              <span>Colorful</span>
            </button>
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">Background Pattern</div>
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => handlePatternChange('none')}
              className={`p-1.5 rounded-md flex items-center justify-center
                ${theme.patternType === 'none' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              title="None"
            >
              <span className="text-xs">None</span>
            </button>
            <button
              onClick={() => handlePatternChange('dots')}
              className={`p-1.5 rounded-md flex items-center justify-center
                ${theme.patternType === 'dots' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              title="Dots"
            >
              <CircleDot size={14} />
            </button>
            <button
              onClick={() => handlePatternChange('waves')}
              className={`p-1.5 rounded-md flex items-center justify-center
                ${theme.patternType === 'waves' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              title="Waves"
            >
              <Waves size={14} />
            </button>
            <button
              onClick={() => handlePatternChange('grid')}
              className={`p-1.5 rounded-md flex items-center justify-center
                ${theme.patternType === 'grid' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              title="Grid"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => handlePatternChange('geometric')}
              className={`p-1.5 rounded-md flex items-center justify-center
                ${theme.patternType === 'geometric' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              title="Geometric"
            >
              <TriangleIcon size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">Animations</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox"
              checked={theme.animationsEnabled}
              onChange={handleToggleAnimations}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher; 