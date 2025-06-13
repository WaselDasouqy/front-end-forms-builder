"use client";

import { memo } from 'react';
import { Form } from '@/types/form';
import { getAnalytics, getCompletionRate, getMostActiveTime } from '@/lib/analytics';

interface FormInsightsProps {
  form: Form;
  className?: string;
}

const FormInsights = memo(({ form, className = '' }: FormInsightsProps) => {
  const analytics = getAnalytics();
  const formAnalytics = analytics[form.id];
  const completionRate = getCompletionRate(form.id);
  const mostActiveTime = getMostActiveTime(form.id);

  const views = formAnalytics?.views || 0;
  const completions = formAnalytics?.completions || 0;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Analytics</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{views}</div>
          <div className="text-xs text-gray-500">Views</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completions}</div>
          <div className="text-xs text-gray-500">Completions</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Completion Rate:</span>
          <span className="font-medium text-gray-900">
            {completionRate.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Most Active:</span>
          <span className="font-medium text-gray-900">
            {mostActiveTime}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Responses:</span>
          <span className="font-medium text-gray-900">
            {form.responseCount || 0}
          </span>
        </div>
      </div>

      {/* Progress bar for completion rate */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Completion Rate</span>
          <span>{completionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(completionRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
});

FormInsights.displayName = 'FormInsights';

export default FormInsights; 