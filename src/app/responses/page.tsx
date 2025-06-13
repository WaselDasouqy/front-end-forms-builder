"use client";

import { useAuth } from "@/lib/authContext";
import { useEffect, useState } from "react";
import { useFormStore } from "@/lib/formStore";
import { responses as responsesApi } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthGuard from "@/components/AuthGuard";
import { FormResponse } from "@/types/form";
import { 
  MagnifyingGlassIcon, 
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface ResponseWithFormTitle extends FormResponse {
  formTitle: string;
}

function ResponsesContent() {
  const { user } = useAuth();
  const { forms: userForms, loadUserForms } = useFormStore();
  const [loading, setLoading] = useState(true);
  const [formResponses, setFormResponses] = useState<ResponseWithFormTitle[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<ResponseWithFormTitle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
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
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, loadUserForms]);

  // Load responses for all forms
  useEffect(() => {
    const fetchResponses = async () => {
      if (userForms.length === 0) return;
      
      try {
        const allResponses: ResponseWithFormTitle[] = [];
        
        // Fetch responses for each form
        for (const form of userForms) {
          try {
            const formResponseData = await responsesApi.getFormResponses(form.id);
            const responsesWithTitle = formResponseData.map((response: any) => ({
              ...response,
              formTitle: form.title || 'Untitled Form'
            }));
            allResponses.push(...responsesWithTitle);
          } catch (err) {
            console.error(`Error loading responses for form ${form.id}:`, err);
          }
        }
        
        // Sort by submission date (newest first)
        allResponses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setFormResponses(allResponses);
        setFilteredResponses(allResponses);
      } catch (err) {
        console.error("Error loading responses:", err);
        setError("Failed to load responses. Please try again later.");
      }
    };

    if (userForms.length > 0) {
      fetchResponses();
    }
  }, [userForms]);

  // Filter responses based on search and filters
  useEffect(() => {
    let filtered = [...formResponses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(response => 
        response.formTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(response.data || {}).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by form
    if (selectedForm !== "all") {
      filtered = filtered.filter(response => response.formId === selectedForm);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(response => 
        new Date(response.createdAt).getTime() >= filterDate.getTime()
      );
    }

    setFilteredResponses(filtered);
  }, [formResponses, searchTerm, selectedForm, dateFilter]);

  const handleDeleteResponse = async (responseId: string) => {
    if (!confirm("Are you sure you want to delete this response?")) return;
    
    try {
      await responsesApi.deleteResponse(responseId);
      setFormResponses(prev => prev.filter(r => r.id !== responseId));
    } catch (err) {
      console.error("Error deleting response:", err);
      setError("Failed to delete response. Please try again.");
    }
  };

  const exportResponses = () => {
    const csvContent = [
      // Header
      ['Form', 'Submitted At', 'Response Data'].join(','),
      // Data rows
      ...filteredResponses.map(response => [
        `"${response.formTitle}"`,
        `"${new Date(response.createdAt).toLocaleString()}"`,
        `"${JSON.stringify(response.data).replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formwave-responses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Loading responses...</p>
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
              Form Responses
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all form submissions across your forms
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              onClick={exportResponses}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search responses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Form Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form
              </label>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Forms</option>
                {userForms.map(form => (
                  <option key={form.id} value={form.id}>
                    {form.title || 'Untitled Form'}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Stats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results
              </label>
              <div className="bg-gray-50 rounded-md px-3 py-2 text-sm">
                <span className="font-medium">{filteredResponses.length}</span> responses found
              </div>
            </div>
          </div>
        </div>

        {/* Responses List */}
        <div className="mt-8">
          {filteredResponses.length > 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Form
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Preview
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResponses.map((response) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {response.formTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(response.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {Object.entries(response.data || {}).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="mb-1">
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                            {Object.keys(response.data || {}).length > 2 && (
                              <div className="text-gray-500">
                                +{Object.keys(response.data || {}).length - 2} more fields
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                alert(JSON.stringify(response.data, null, 2));
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteResponse(response.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No responses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {formResponses.length === 0 
                  ? "No responses have been submitted to your forms yet."
                  : "No responses match your current filters."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResponsesPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ResponsesContent />
    </AuthGuard>
  );
} 