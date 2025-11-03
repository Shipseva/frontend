"use client";

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Clock, CheckCircle, FileText, Loader2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Status } from '@/store/api/userApi';
import { useGetUserDocumentsQuery, UserKYCDocument } from '@/store/api/kycApi';

interface KYCStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'rejected' | 'verified';
}

export const KYCStatusModal: React.FC<KYCStatusModalProps> = ({ isOpen, onClose, status }) => {
  const router = useRouter();
  const [showDocuments, setShowDocuments] = useState(false);
  
  // Fetch documents when user clicks "View Status"
  const { data: documents, isLoading, isError } = useGetUserDocumentsQuery(undefined, {
    skip: !isOpen || !showDocuments,
  });

  // Reset showDocuments when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowDocuments(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isPending = status === Status.PENDING;
  const isRejected = status === Status.REJECTED;

  const handleViewStatus = () => {
    setShowDocuments(true);
  };

  const handleUpdateKYC = () => {
    onClose();
    router.push('/dashboard/kyc');
  };

  const renderDocumentStatus = (docStatus: string) => {
    const statusColors = {
      pending: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[docStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {docStatus}
      </span>
    );
  };

  // Show documents view if user clicked "View Status"
  if (showDocuments) {
    const document = documents && documents.length > 0 ? documents[0] : null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  KYC Document Details
                </h3>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Loading documents...</span>
                </div>
              ) : isError ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                  <p className="mt-2 text-sm text-gray-600">Failed to load documents. Please try again.</p>
                </div>
              ) : !document ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">No KYC documents found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Overall Status:</span>
                      {renderDocumentStatus(document.status)}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Submitted: {new Date(document.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Aadhar Card */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Aadhar Card</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-600">Number:</span>
                        <p className="text-sm font-medium text-gray-900">{document.aadhar.aadharNumber}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-600 block mb-1">Front</span>
                          <a 
                            href={document.aadhar.aadharFront} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            View <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                          {renderDocumentStatus(document.aadhar.documentStatus)}
                        </div>
                        <div>
                          <span className="text-xs text-gray-600 block mb-1">Back</span>
                          <a 
                            href={document.aadhar.aadharBack} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            View <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">PAN Card</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-600">Number:</span>
                        <p className="text-sm font-medium text-gray-900">{document.pan.panNumber}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-600 block mb-1">Front</span>
                          <a 
                            href={document.pan.panFront} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            View <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                          {renderDocumentStatus(document.pan.documentStatus)}
                        </div>
                        <div>
                          <span className="text-xs text-gray-600 block mb-1">Back</span>
                          <a 
                            href={document.pan.panBack} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            View <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  {document.bankName && (
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Bank Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-xs text-gray-600">Bank Name:</span>
                          <p className="font-medium">{document.bankName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Account Holder:</span>
                          <p className="font-medium">{document.accountHolderName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Account Number:</span>
                          <p className="font-medium">{document.accountNumber}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">IFSC:</span>
                          <p className="font-medium">{document.ifsc}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GST Details */}
                  {document.gstNumber && (
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">GST Details</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-600">GST Number:</span>
                          <p className="text-sm font-medium">{document.gstNumber}</p>
                        </div>
                        {document.gstCertificate && (
                          <div>
                            <span className="text-xs text-gray-600 block mb-1">Certificate</span>
                            <a 
                              href={document.gstCertificate} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-primary hover:underline"
                            >
                              View Certificate <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleUpdateKYC}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              >
                Update KYC
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial modal view
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start">
              <div className={`flex-shrink-0 mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                isPending ? 'bg-blue-100' : 'bg-yellow-100'
              }`}>
                {isPending ? (
                  <Clock className="h-6 w-6 text-blue-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isPending ? 'KYC Verification Pending' : 'KYC Verification Rejected'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {isPending 
                      ? 'Your KYC verification is currently under review. Our team will process your documents shortly.'
                      : 'Your KYC verification has been rejected. Please review and update your documents to complete the verification process.'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!isPending && (
              <button
                type="button"
                onClick={handleUpdateKYC}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              >
                Update KYC
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 ${!isPending ? 'sm:ml-3' : ''} sm:w-auto sm:text-sm`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
