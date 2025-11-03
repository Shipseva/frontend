"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface KYCWarningToastProps {
  toast: { id: string; dismiss: () => void };
  status?: 'pending' | 'rejected';
}

export const KYCWarningToast: React.FC<KYCWarningToastProps> = ({ toast: toastInstance, status = 'rejected' }) => {
  const router = useRouter();

  const handleUpdateKYC = () => {
    toast.dismiss(toastInstance.id);
    router.push('/dashboard/kyc');
  };

  const handleSkip = () => {
    toast.dismiss(toastInstance.id);
  };

  const isPending = status === 'pending';
  const title = isPending ? 'KYC Verification Pending' : 'KYC Verification Required';
  const message = isPending 
    ? 'Your KYC is under review. You can still update your documents while waiting.'
    : 'Your KYC has been rejected. Please update your documents to access all features.';

  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${isPending ? 'bg-blue-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center`}>
              <svg className={`w-5 h-5 ${isPending ? 'text-blue-600' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
                {isPending ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                )}
              </svg>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {message}
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleUpdateKYC}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary-light transition-colors"
              >
                Update KYC
              </button>
              <button
                onClick={handleSkip}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
              >
                Skip for this time
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={handleSkip}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
