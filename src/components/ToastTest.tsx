"use client";

import { useState } from 'react';
import { useGetUserQuery, useLogoutUserMutation } from '@/store/api/userApi';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '@/utils/toast';

export const ToastTest = () => {
  const [testMessage, setTestMessage] = useState('Test message');
  
  // API hooks
  const { refetch: refetchUser } = useGetUserQuery();
  const [logoutUser] = useLogoutUserMutation();
  const [createOrder] = useCreateOrderMutation();

  const testToastTypes = () => {
    showSuccessToast('Success toast!');
    showErrorToast('Error toast!');
    showInfoToast('Info toast!');
    showWarningToast('Warning toast!');
  };

  const testApiSuccess = async () => {
    try {
      await refetchUser();
      // Toast will be shown automatically by the API
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  const testApiError = async () => {
    try {
      // This will likely fail and show error toast
      await createOrder({
        // Invalid data to trigger error
        sender: {} as any,
        receiver: {} as any,
        package: {} as any,
      });
    } catch (error) {
      console.error('Expected error:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Toast Test Component</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Message:</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={testToastTypes}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Test Toast Types
          </button>
          
          <button
            onClick={testApiSuccess}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Test API Success
          </button>
          
          <button
            onClick={testApiError}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Test API Error
          </button>
          
          <button
            onClick={() => showSuccessToast(testMessage)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Custom Message
          </button>
        </div>
      </div>
    </div>
  );
};
