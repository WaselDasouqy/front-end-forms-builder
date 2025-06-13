"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';

export default function TestAuthPage() {
  const { user, login, register } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    setResult('');
    try {
      await register(email, password);
      setResult('Registration successful! Check console for details.');
    } catch (error) {
      setResult(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('');
    try {
      await login(email, password);
      setResult('Login successful! Check console for details.');
    } catch (error) {
      setResult(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setResult('');
    try {
      // Test registration first
      const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'direct-test@example.com', password: 'password123' })
      });
      
      const registerData = await registerResponse.json();
      console.log('Direct API register response:', registerData);
      
      // Test login
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'direct-test@example.com', password: 'password123' })
      });
      
      const loginData = await loginResponse.json();
      console.log('Direct API login response:', loginData);
      
      setResult(`Direct API test - Register: ${registerResponse.status}, Login: ${loginResponse.status}`);
      
    } catch (error) {
      setResult(`Direct API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication Test</h2>
          
          {user && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="text-green-800 font-semibold">Current User:</h3>
              <p className="text-green-700">Email: {user.email}</p>
              <p className="text-green-700">ID: {user.id}</p>
              <p className="text-green-700">Verified: {user.email_verified ? 'Yes' : 'No'}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={testRegister}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Test Register
              </button>
              
              <button
                onClick={testLogin}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Test Login
              </button>
            </div>

            <button
              onClick={testDirectAPI}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Test Direct API
            </button>

            {result && (
              <div className={`p-4 rounded-md ${
                result.includes('successful') || result.includes('200') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm">{result}</p>
              </div>
            )}

            {loading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-sm text-gray-600">Testing...</span>
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Debug Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>First try "Test Register" to create a test account</li>
              <li>Then try "Test Login" with the same credentials</li>
              <li>Check browser console for detailed error messages</li>
              <li>Use "Test Direct API" to bypass the frontend API layer</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 