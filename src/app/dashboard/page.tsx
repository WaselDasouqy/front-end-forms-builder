"use client";

import { useAuth } from "@/lib/authContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthGuard from "@/components/AuthGuard";
import { useFormStore } from "@/lib/formStore";
import FormInsights from "@/components/analytics/FormInsights";
import ResponseChart from "@/components/analytics/ResponseChart";
import { EyeIcon, LinkIcon, ClipboardIcon } from '@heroicons/react/24/outline';

function DashboardContent() {
  const { user } = useAuth();
  const { forms: userForms, loadUserForms } = useFormStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Fetch user forms and statistics
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError("");
        
        // Load forms from the backend
        await loadUserForms();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, loadUserForms]);

  // Calculate statistics from loaded forms
  const formCount = userForms.length;
  const responseCount = userForms.reduce((total, form) => total + (form.responseCount || 0), 0);

  const handleCopyLink = async (formId: string) => {
    const shareUrl = `${window.location.origin}/forms/view/${formId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(formId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shortenUrl = (formId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/forms/view/${formId}`.replace(baseUrl, '').substring(0, 25) + '...';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.email}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/forms/builder"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Form
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Forms</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{formCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/forms/builder" className="font-medium text-indigo-700 hover:text-indigo-900">
                  Create your first form
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{responseCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/responses" className="font-medium text-indigo-700 hover:text-indigo-900">
                  View all responses
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Response Rate</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {formCount > 0 ? Math.round((responseCount / formCount) * 100) / 100 : 0}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/analytics" className="font-medium text-indigo-700 hover:text-indigo-900">
                  View analytics
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Forms list with insights */}
        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">Recent Forms</h2>
              <p className="mt-2 text-sm text-gray-700">
                A list of all your forms with analytics and sharing options.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            {userForms.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Forms List */}
                <div className="lg:col-span-2">
                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-4">
                        {userForms.map((form) => (
                          <div key={form.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {form.title || "Untitled Form"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {form.description || "No description"}
                                </p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{form.responseCount || 0} responses</span>
                                </div>
                                
                                {/* Public Link */}
                                <div className="mt-3 flex items-center space-x-2">
                                  <LinkIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                                    {shortenUrl(form.id)}
                                  </span>
                                  <button
                                    onClick={() => handleCopyLink(form.id)}
                                    className={`text-xs px-2 py-1 rounded transition-colors ${
                                      copiedLink === form.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    <ClipboardIcon className="h-3 w-3 inline mr-1" />
                                    {copiedLink === form.id ? 'Copied!' : 'Copy'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex flex-col space-y-2 ml-4">
                                <a
                                  href={`/forms/view/${form.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <EyeIcon className="h-3 w-3 mr-1" />
                                  Preview
                                </a>
                                <Link
                                  href={`/forms/builder?formId=${form.id}`}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => setSelectedForm(selectedForm === form.id ? null : form.id)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  {selectedForm === form.id ? 'Hide' : 'Analytics'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Insights Panel */}
                <div className="lg:col-span-1">
                  {selectedForm ? (
                    <div className="space-y-4">
                      <FormInsights 
                        form={userForms.find(f => f.id === selectedForm)!} 
                      />
                      <ResponseChart formId={selectedForm} />
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Form Analytics</h3>
                      <p className="text-xs text-gray-500">
                        Select a form to view detailed analytics and insights.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No forms yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first form.</p>
                <div className="mt-6">
                  <Link
                    href="/forms/builder"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create your first form
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  );
} 