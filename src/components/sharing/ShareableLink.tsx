"use client";

import { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'react-share';

interface ShareableLinkProps {
  formId: string;
  formTitle: string;
  className?: string;
}

export default function ShareableLink({ formId, formTitle, className = '' }: ShareableLinkProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/forms/view/${formId}`;
  const shareTitle = `Check out this form: ${formTitle}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Share Your Form</h3>
      
      {/* Shareable URL */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Public Link
        </label>
        <div className="flex">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium ${
              copied 
                ? 'bg-green-100 text-green-700 border-green-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Share on Social Media
        </label>
        <div className="flex space-x-2">
          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <WhatsappIcon size={36} round />
          </WhatsappShareButton>
          
          <FacebookShareButton url={shareUrl} title={shareTitle}>
            <FacebookIcon size={36} round />
          </FacebookShareButton>
          
          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <TwitterIcon size={36} round />
          </TwitterShareButton>
          
          <LinkedinShareButton url={shareUrl} title={shareTitle}>
            <LinkedinIcon size={36} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
} 