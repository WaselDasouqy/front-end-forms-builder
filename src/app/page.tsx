"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PlusIcon, ChartBarIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

function HomeContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Welcome to{' '}
            <span className="relative whitespace-nowrap text-indigo-600">
              <span className="relative">FormWave</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Create beautiful, responsive forms in minutes. Collect responses, analyze data, and grow your business with our powerful form builder.
          </p>
          
          {user && (
            <div className="mt-4 text-sm text-slate-600">
              Welcome back, <span className="font-medium text-indigo-600">{user.email}</span>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {user ? (
              <>
                {/* Dashboard Card */}
                <Link href="/dashboard" className="group relative">
                  <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 transition duration-300 hover:shadow-xl hover:ring-slate-900/10">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 group-hover:bg-indigo-600 transition-colors">
                        <ChartBarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">Dashboard</div>
                        <div className="text-sm text-slate-600">View & Manage</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-slate-900">Control Panel</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        View your forms, analyze responses, and get insights into your data. Monitor performance and track engagement.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      Go to Dashboard
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>

                {/* Create Form Card */}
                <Link href="/forms/builder" className="group relative">
                  <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 transition duration-300 hover:shadow-xl hover:ring-slate-900/10">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 group-hover:bg-emerald-600 transition-colors">
                        <PlusIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">Create</div>
                        <div className="text-sm text-slate-600">Build Forms</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-slate-900">Form Builder</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Design and create professional forms with our drag-and-drop builder. Add fields, customize themes, and publish instantly.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                      Start Building
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </>
            ) : (
              <>
                {/* Login Card */}
                <Link href="/login" className="group relative">
                  <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 transition duration-300 hover:shadow-xl hover:ring-slate-900/10">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 group-hover:bg-indigo-600 transition-colors">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">Login</div>
                        <div className="text-sm text-slate-600">Access Account</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-slate-900">Sign In</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Access your dashboard, manage forms, and view analytics. Get started with your existing account.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      Sign In
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>

                {/* Register Card */}
                <Link href="/register" className="group relative">
                  <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 transition duration-300 hover:shadow-xl hover:ring-slate-900/10">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 group-hover:bg-emerald-600 transition-colors">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">Register</div>
                        <div className="text-sm text-slate-600">Create Account</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-slate-900">Get Started</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Create your free account and start building forms immediately. No credit card required.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                      Sign Up Free
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto max-w-5xl mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to collect data
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Powerful features to help you create, share, and analyze forms
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">Drag & Drop Builder</h3>
              <p className="mt-2 text-sm text-slate-600">
                Create forms effortlessly with our intuitive drag-and-drop interface. No coding required.
              </p>
            </div>

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">Real-time Analytics</h3>
              <p className="mt-2 text-sm text-slate-600">
                Get instant insights into your form performance with detailed analytics and reporting.
              </p>
            </div>

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">Response Management</h3>
              <p className="mt-2 text-sm text-slate-600">
                Collect, organize, and manage responses efficiently with our powerful dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-4xl mt-20 mb-20 text-center">
          <div className="rounded-2xl bg-indigo-600 p-8 text-white sm:p-12">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mt-4 text-lg text-indigo-100">
              Create your first form in minutes and start collecting responses today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    href="/forms/builder"
                    className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Create Your First Form
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-medium text-white hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  >
                    <ChartBarIcon className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-medium text-white hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return <HomeContent />;
}
