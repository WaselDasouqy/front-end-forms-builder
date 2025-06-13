"use client";

import { useAuth } from "@/lib/authContext";
import { useEffect, useState } from "react";
import { useFormStore } from "@/lib/formStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthGuard from "@/components/AuthGuard";
import { getAnalytics, FormAnalytics } from "@/lib/analytics";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

function AnalyticsContent() {
  const { user } = useAuth();
  const { forms: userForms, loadUserForms } = useFormStore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Record<string, FormAnalytics>>({});
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");
  const [error, setError] = useState("");

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError("");
        
        // Load forms first
        await loadUserForms();
        
        // Load analytics data
        const analyticsData = getAnalytics();
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, loadUserForms]);

  // Calculate aggregate statistics
  const totalViews = Object.values(analytics).reduce((sum, form) => sum + form.views, 0);
  const totalCompletions = Object.values(analytics).reduce((sum, form) => sum + form.completions, 0);
  const averageCompletionRate = totalViews > 0 ? (totalCompletions / totalViews) * 100 : 0;

  // Prepare data for charts
  const formPerformanceData = userForms.map(form => {
    const formAnalytics = analytics[form.id];
    return {
      name: form.title?.substring(0, 20) + (form.title && form.title.length > 20 ? '...' : '') || 'Untitled',
      views: formAnalytics?.views || 0,
      completions: formAnalytics?.completions || 0,
      completionRate: formAnalytics && formAnalytics.views > 0 
        ? ((formAnalytics.completions / formAnalytics.views) * 100).toFixed(1) 
        : 0
    };
  });

  // Generate daily analytics data for trend charts
  const dailyAnalyticsData = generateDailyData(analytics, parseInt(selectedPeriod));

  // Completion rate distribution
  const completionRateDistribution = [
    { name: 'Excellent (80-100%)', value: 0, color: '#10b981' },
    { name: 'Good (60-79%)', value: 0, color: '#3b82f6' },
    { name: 'Average (40-59%)', value: 0, color: '#f59e0b' },
    { name: 'Needs Improvement (0-39%)', value: 0, color: '#ef4444' }
  ];

  formPerformanceData.forEach(form => {
    const rate = parseFloat(form.completionRate as string);
    if (rate >= 80) completionRateDistribution[0].value++;
    else if (rate >= 60) completionRateDistribution[1].value++;
    else if (rate >= 40) completionRateDistribution[2].value++;
    else completionRateDistribution[3].value++;
  });

  // Top performing forms
  const topForms = [...formPerformanceData]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive insights into your form performance and user engagement
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalViews.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Completions</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalCompletions.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Completion Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{averageCompletionRate.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Forms</dt>
                    <dd className="text-lg font-medium text-gray-900">{userForms.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views vs Completions Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Form Performance Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#3b82f6" name="Views" />
                  <Bar dataKey="completions" fill="#10b981" name="Completions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Trends Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyAnalyticsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="completions" stroke="#10b981" fillOpacity={1} fill="url(#colorCompletions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Completion Rate Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Rate Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionRateDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {completionRateDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Forms */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Forms</h3>
            <div className="space-y-4">
              {topForms.map((form, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{form.name}</p>
                      <p className="text-xs text-gray-500">{form.completionRate}% completion rate</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{form.views} views</p>
                    <p className="text-xs text-gray-500">{form.completions} completions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics Table */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Detailed Form Analytics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formPerformanceData.map((form, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {form.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {form.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {form.completions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(form.completionRate as string) >= 80 
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(form.completionRate as string) >= 60
                          ? 'bg-blue-100 text-blue-800'
                          : parseFloat(form.completionRate as string) >= 40
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {form.completionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {analytics[userForms[index]?.id]?.lastViewed 
                        ? new Date(analytics[userForms[index].id].lastViewed).toLocaleDateString()
                        : 'No activity'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate daily analytics data
function generateDailyData(analytics: Record<string, FormAnalytics>, days: number) {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    let dailyViews = 0;
    let dailyCompletions = 0;
    
    Object.values(analytics).forEach(formAnalytics => {
      // Count views for this day
      const dayViews = formAnalytics.viewHistory.filter(viewDate => {
        const viewDay = new Date(viewDate);
        return viewDay.toDateString() === date.toDateString();
      }).length;
      
      // Count completions for this day
      const dayCompletions = formAnalytics.completionHistory.filter(completionDate => {
        const completionDay = new Date(completionDate);
        return completionDay.toDateString() === date.toDateString();
      }).length;
      
      dailyViews += dayViews;
      dailyCompletions += dayCompletions;
    });
    
    data.push({
      date: dateStr,
      views: dailyViews,
      completions: dailyCompletions
    });
  }
  
  return data;
}

export default function AnalyticsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AnalyticsContent />
    </AuthGuard>
  );
} 