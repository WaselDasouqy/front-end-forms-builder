"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { forms, responses } from '@/lib/api';
import { Form } from '@/types/form';
import { trackFormView, trackFormCompletion } from '@/lib/analytics';
import LoadingSpinner from '@/components/LoadingSpinner';
import FormRenderer from '@/components/forms/FormRenderer';

export default function PublicFormViewPage() {
  const { formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) return;
      
      try {
        setLoading(true);
        const formData = await forms.getFormById(formId as string);
        setForm(formData);
        
        // Track form view
        trackFormView(formId as string);
      } catch (err) {
        console.error('Error loading form:', err);
        setError('Form not found or not accessible');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const handleSubmit = async (responseData: Record<string, any>) => {
    if (!formId) return;
    
    try {
      setSubmitting(true);
      await responses.submitFormResponse(formId as string, responseData);
      
      // Track completion
      trackFormCompletion(formId as string);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Form
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-green-500 text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Thank You!
          </h2>
          <p className="text-gray-600">
            {form?.settings?.confirmationMessage || 'Your response has been submitted successfully.'}
          </p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <FormRenderer 
          form={form} 
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
} 