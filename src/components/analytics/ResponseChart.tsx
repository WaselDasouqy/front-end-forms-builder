"use client";

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnalytics } from '@/lib/analytics';

interface ResponseChartProps {
  formId: string;
  className?: string;
}

export default function ResponseChart({ formId, className = '' }: ResponseChartProps) {
  const chartData = useMemo(() => {
    const analytics = getAnalytics();
    const formAnalytics = analytics[formId];
    
    if (!formAnalytics || formAnalytics.viewHistory.length === 0) {
      return [];
    }

    // Group data by day
    const dailyData: Record<string, { date: string; views: number; completions: number }> = {};
    
    // Process views
    formAnalytics.viewHistory.forEach(date => {
      const dayKey = date.toISOString().split('T')[0];
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = { date: dayKey, views: 0, completions: 0 };
      }
      dailyData[dayKey].views += 1;
    });
    
    // Process completions
    formAnalytics.completionHistory.forEach(date => {
      const dayKey = date.toISOString().split('T')[0];
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = { date: dayKey, views: 0, completions: 0 };
      }
      dailyData[dayKey].completions += 1;
    });

    // Convert to array and sort by date
    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7) // Last 7 days
      .map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));
  }, [formId]);

  if (chartData.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Response Trends</h4>
        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
          No data available for the chart
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Response Trends (Last 7 Days)</h4>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={{ fill: '#4f46e5', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4, stroke: '#4f46e5', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="completions" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center space-x-4 mt-2">
        <div className="flex items-center text-xs">
          <div className="w-3 h-0.5 bg-indigo-600 mr-1"></div>
          <span className="text-gray-600">Views</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-0.5 bg-green-500 mr-1"></div>
          <span className="text-gray-600">Completions</span>
        </div>
      </div>
    </div>
  );
} 