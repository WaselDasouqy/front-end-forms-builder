"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HomePage() {
  const { user, loading } = useAuth();

  // Show loading state while auth state is being determined
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">FormWave</h1>
          <p className="text-xl text-gray-600">
            Create, manage, and share forms with ease
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-gray-500">
            Build beautiful forms with our drag-and-drop form builder.
            {!user && " No account required - just start creating!"}
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/forms/builder"
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-md text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50"
                >
                  Create New Form
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-md text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Drag & Drop</h3>
              <p className="text-sm text-gray-500">Easily build forms with our intuitive drag and drop interface</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Multiple Field Types</h3>
              <p className="text-sm text-gray-500">Choose from a variety of field types for your forms</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Form Preview</h3>
              <p className="text-sm text-gray-500">See how your form will look in real-time as you build</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Share Forms</h3>
              <p className="text-sm text-gray-500">Generate public links to share your forms with others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 