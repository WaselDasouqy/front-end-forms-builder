import Link from "next/link";
import { Form } from "@/types/form";
import { Calendar, Moon, Sun, Palette, Hash, PenSquare, Eye } from "lucide-react";

interface FormCardProps {
  form: Form;
}

export default function FormCard({ form }: FormCardProps) {
  // Get theme type icon
  const getThemeIcon = () => {
    const theme = form.settings?.theme;
    if (!theme) return <Sun size={14} />;
    
    switch (theme.mode) {
      case 'dark':
        return <Moon size={14} className="text-indigo-600" />;
      case 'colorful':
        return <Palette size={14} className="text-pink-500" />;
      default:
        return <Sun size={14} className="text-amber-500" />;
    }
  };
  
  // Get theme badge class
  const getThemeBadgeClass = () => {
    const theme = form.settings?.theme;
    if (!theme) return "bg-gray-100 text-gray-800";
    
    switch (theme.mode) {
      case 'dark':
        return "bg-indigo-100 text-indigo-800";
      case 'colorful':
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };
  
  // Format dates for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-200">
      <div className="px-4 py-4 sm:p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate">{form.title}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getThemeBadgeClass()}`}>
            {getThemeIcon()}
            <span className="ml-1">{form.settings?.theme?.mode || 'Light'}</span>
          </span>
        </div>
        
        {form.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{form.description}</p>
        )}
        
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex items-center text-xs text-gray-500">
            <Hash size={12} className="mr-1" />
            <span>{form.fields.length} fields</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Eye size={12} className="mr-1" />
            <span>0 responses</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={12} className="mr-1" />
            <span>Created: {formatDate(form.createdAt)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <PenSquare size={12} className="mr-1" />
            <span>Updated: {formatDate(form.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 sm:px-5 flex justify-between border-t border-gray-100">
        <Link
          href={`/forms/view/${form.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Form
        </Link>
        <Link
          href={`/forms/builder?formId=${form.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
        >
          <PenSquare size={16} className="mr-1" />
          Edit Form
        </Link>
      </div>
    </div>
  );
} 