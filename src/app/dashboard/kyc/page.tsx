"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Building2, Loader2, Clock } from 'lucide-react';
import { RootState } from '@/store';
import Input from '@/components/forms/Input';
import S3FileUpload from '@/components/forms/S3FileUpload';
import FormWrapper from '@/components/forms/FormWrapper';
import { useForm } from '@/components/forms/useForm';
import { panValidator, aadharValidator, gstValidator, ifscValidator, accountNumberValidator } from '@/components/forms/validators';
import { useSubmitKYCMutation, useGetUserDocumentsQuery, useUpdateKYCMutation, KYCSubmissionData, UserKYCDocument, UpdateKYCData } from '@/store/api/kycApi';
import { uploadFile } from '@/lib/upload';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Status } from '@/store/api/userApi';

const KYCPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const hasShownRejectedToastRef = useRef(false);
  
  // API hooks
  const [submitKYC, { isLoading: isSubmitting }] = useSubmitKYCMutation();
  const [updateKYC, { isLoading: isUpdating }] = useUpdateKYCMutation();
  const { data: documents, isLoading: isLoadingDocuments } = useGetUserDocumentsQuery();
  
  // Check if KYC documents exist
  const hasDocuments = documents && documents.length > 0;
  const kycDocument = hasDocuments ? documents[0] : null;
  
  // Check if any document is rejected (even if overall status is pending)
  const hasRejectedDocuments = kycDocument && (
    kycDocument.aadhar.documentStatus === 'rejected' ||
    kycDocument.pan.documentStatus === 'rejected'
  );
  
  // Check if all documents are pending (no rejected documents)
  const allDocumentsPending = kycDocument && 
    !hasRejectedDocuments &&
    kycDocument.aadhar.documentStatus === 'pending' &&
    kycDocument.pan.documentStatus === 'pending';
  
  // Memoize rejected documents list to prevent unnecessary re-renders
  const { rejectedDocumentsList, rejectedDocumentsMap } = useMemo(() => {
    const list: string[] = [];
    const map: { [key: string]: boolean } = {};
    
    if (kycDocument) {
      if (kycDocument.aadhar.documentStatus === 'rejected') {
        list.push('Aadhar Card');
        map.aadhar = true;
      }
      if (kycDocument.pan.documentStatus === 'rejected') {
        list.push('PAN Card');
        map.pan = true;
      }
    }
    
    return { rejectedDocumentsList: list, rejectedDocumentsMap: map };
  }, [kycDocument?.aadhar.documentStatus, kycDocument?.pan.documentStatus]);
  
  // Prefill initial values from existing document if available
  const getInitialValues = () => {
    if (hasRejectedDocuments && kycDocument) {
      return {
        panNumber: kycDocument.pan.panNumber || '',
        panDocument: null as File | null,
        aadharNumber: kycDocument.aadhar.aadharNumber || '',
        aadharFront: null as File | null,
        aadharBack: null as File | null,
        gstNumber: kycDocument.gstNumber || '',
        gstDocument: null as File | null,
        bankAccountNumber: kycDocument.accountNumber || '',
        bankName: kycDocument.bankName || '',
        bankIfsc: kycDocument.ifsc || '',
        bankDocument: null as File | null,
      };
    }
    return {
      panNumber: '',
      panDocument: null as File | null,
      aadharNumber: '',
      aadharFront: null as File | null,
      aadharBack: null as File | null,
      gstNumber: '',
      gstDocument: null as File | null,
      bankAccountNumber: '',
      bankName: '',
      bankIfsc: '',
      bankDocument: null as File | null,
    };
  };
  
  const initialValues = getInitialValues();

  const handleSubmit = async (formValues: typeof initialValues) => {
    // Prevent multiple submissions
    if (hasSubmittedRef.current || isSubmittingRef.current || isSubmittingForm || isSubmitting) {
      console.log('BLOCKING: Form already submitted or in progress');
      return;
    }
    
    console.log('✅ STARTING KYC SUBMISSION');
    hasSubmittedRef.current = true;
    isSubmittingRef.current = true;
    setIsSubmittingForm(true);
    
    try {
      // Step 1: Upload all files to S3
      console.log('📤 UPLOADING FILES TO S3...');
      const fileUploadPromises: Promise<{ fileUrl: string }>[] = [];
      const fileFields = [
        { field: 'panDocument', documentType: 'pan' },
        { field: 'aadharFront', documentType: 'aadhar_front' },
        { field: 'aadharBack', documentType: 'aadhar_back' },
        { field: 'gstDocument', documentType: 'gst' },
        { field: 'bankDocument', documentType: 'bank' }
      ];
      
      for (const { field, documentType } of fileFields) {
        const file = formValues[field as keyof typeof formValues] as File | null;
        if (file) {
          console.log(`Uploading ${field}:`, file.name);
            fileUploadPromises.push(
              uploadFile(file, documentType, undefined, 'kyc')
            );
        }
      }
      
      // Wait for all file uploads to complete
      const uploadResults = await Promise.all(fileUploadPromises);
      console.log('✅ ALL FILES UPLOADED:', uploadResults);
      
      // Step 2: Map uploaded files to their URLs
      const uploadedUrls: Record<string, string> = {};
      let uploadIndex = 0;
      for (const { field } of fileFields) {
        const file = formValues[field as keyof typeof formValues] as File | null;
        if (file) {
          uploadedUrls[field] = uploadResults[uploadIndex].fileUrl;
          uploadIndex++;
        }
      }
      
      console.log('📋 UPLOADED URLS:', uploadedUrls);
      
      // Step 3: Check if we're updating existing KYC or creating new one
      if (hasRejectedDocuments && kycDocument) {
        // Update existing KYC - only send changed fields
        const updateData: UpdateKYCData = {};
        
        // Update aadhar if rejected or if new files are uploaded or if number is changed
        const shouldUpdateAadhar = rejectedDocumentsMap.aadhar || 
          uploadedUrls.aadharFront || 
          uploadedUrls.aadharBack ||
          (formValues.aadharNumber && formValues.aadharNumber !== kycDocument.aadhar.aadharNumber);
        
        if (shouldUpdateAadhar) {
          updateData.aadhar = {
            ...(formValues.aadharNumber && { aadharNumber: formValues.aadharNumber }),
            ...(uploadedUrls.aadharFront && { aadharFront: uploadedUrls.aadharFront }),
            ...(uploadedUrls.aadharBack && { aadharBack: uploadedUrls.aadharBack }),
            documentStatus: 'pending',
          };
        }
        
        // Update pan if rejected or if new file is uploaded or if number is changed
        const shouldUpdatePan = rejectedDocumentsMap.pan || 
          uploadedUrls.panDocument ||
          (formValues.panNumber && formValues.panNumber !== kycDocument.pan.panNumber);
        
        if (shouldUpdatePan) {
          updateData.pan = {
            ...(formValues.panNumber && { panNumber: formValues.panNumber }),
            ...(uploadedUrls.panDocument && { 
              panFront: uploadedUrls.panDocument,
              panBack: uploadedUrls.panDocument 
            }),
            documentStatus: 'pending',
          };
        }
        
        // Update optional fields if provided
        if (formValues.bankIfsc || formValues.bankAccountNumber || formValues.bankName) {
          updateData.ifsc = formValues.bankIfsc || kycDocument.ifsc;
          updateData.accountNumber = formValues.bankAccountNumber || kycDocument.accountNumber;
          updateData.bankName = formValues.bankName || kycDocument.bankName;
          updateData.accountHolderName = user?.name || kycDocument.accountHolderName;
        }
        
        if (formValues.gstNumber || uploadedUrls.gstDocument) {
          updateData.gstNumber = formValues.gstNumber || kycDocument.gstNumber;
          if (uploadedUrls.gstDocument) {
            updateData.gstCertificate = uploadedUrls.gstDocument;
          }
        }
        
        console.log('🚀 UPDATING KYC DATA:', updateData);
        
        // Step 4: Update KYC data
        const result = await updateKYC({ id: kycDocument.id, data: updateData }).unwrap();
        console.log('✅ KYC UPDATE SUCCESS:', result);
        
        // Toast is automatically shown by baseQueryWithToasts
        // Only navigate to dashboard on success
        if (result.success) {
          router.push('/dashboard');
        }
        // If result.success is false, stay on the page (error toast already shown by baseQuery)
      } else {
        // Create new KYC submission
        const kycData: KYCSubmissionData = {
          aadhar: {
            aadharNumber: formValues.aadharNumber,
            aadharFront: uploadedUrls.aadharFront || '',
            aadharBack: uploadedUrls.aadharBack || '',
            isVerified: false,
          },
          pan: {
            panNumber: formValues.panNumber,
            panFront: uploadedUrls.panDocument || '',
            panBack: uploadedUrls.panDocument || '', // Assuming single PAN document
            isVerified: false,
          },
          ifsc: formValues.bankIfsc || undefined,
          accountNumber: formValues.bankAccountNumber || undefined,
          accountHolderName: user?.name || undefined,
          bankName: formValues.bankName || undefined,
          branchName: undefined,
          gstNumber: formValues.gstNumber || undefined,
          gstCertificate: uploadedUrls.gstDocument || undefined,
          businessType: 'individual',
        };
        
        console.log('🚀 SUBMITTING KYC DATA:', kycData);
        
        // Step 4: Submit KYC data
        const result = await submitKYC(kycData).unwrap();
        console.log('✅ KYC SUBMISSION SUCCESS:', result);
        
        // Toast is automatically shown by baseQueryWithToasts
        // Only navigate to dashboard on success
        if (result.success) {
          router.push('/dashboard');
        }
        // If result.success is false, stay on the page (error toast already shown by baseQuery)
      }
    } catch (error: unknown) {
      console.error('❌ KYC SUBMISSION ERROR:', error);
      // Error toast is automatically shown by baseQueryWithToasts
      // Reset submission state on error so user can try again
      hasSubmittedRef.current = false;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmittingForm(false);
    }
  };

  // Define validation schema
  const validationSchema = {
    panNumber: panValidator,
    panDocument: Yup.mixed().nullable(),
    aadharNumber: aadharValidator,
    aadharFront: Yup.mixed().nullable(),
    aadharBack: Yup.mixed().nullable(),
    gstNumber: gstValidator,
    gstDocument: Yup.mixed().nullable(),
    bankAccountNumber: accountNumberValidator,
    bankName: Yup.string().optional(),
    bankIfsc: ifscValidator,
    bankDocument: Yup.mixed().nullable(),
  };

  // Use the form hook
  const formik = useForm({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const { values, errors, touched, setFieldValue } = formik;

  const steps = [
    { id: 1, title: 'PAN & Aadhar', icon: FileText },
    { id: 2, title: 'GST & Bank Details', icon: Building2 },
  ];


  const validateCurrentStep = () => {
    if (currentStep === 1) {
      // Validate PAN and Aadhar (mandatory fields)
      const errors = [];
      
      if (!values.panNumber.trim()) {
        errors.push('PAN number is required');
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber)) {
        errors.push('PAN number format is invalid (e.g., ABCDE1234F)');
      }
      
      if (!values.panDocument) {
        errors.push('PAN document is required');
      }
      
      if (!values.aadharNumber.trim()) {
        errors.push('Aadhar number is required');
      } else if (!/^[0-9]{12}$/.test(values.aadharNumber)) {
        errors.push('Aadhar number must be 12 digits');
      }
      
      if (!values.aadharFront) {
        errors.push('Aadhar front document is required');
      }
      
      if (!values.aadharBack) {
        errors.push('Aadhar back document is required');
      }
      
      if (errors.length > 0) {
        // Don't show toast here - just return false for validation
        // Toast will be shown by the calling function if needed
        return false;
      }
    }
    
    return true;
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('🔄 NEXT BUTTON CLICKED - Step:', currentStep);
    if (validateCurrentStep() && currentStep < 2) {
      console.log('✅ Moving to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log('❌ Cannot move to next step - validation failed or already at last step');
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('🔄 PREVIOUS BUTTON CLICKED - Step:', currentStep);
    if (currentStep > 1) {
      console.log('✅ Moving to previous step:', currentStep - 1);
      setCurrentStep(currentStep - 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // File change handlers - now stores File objects locally
  const handleFileChange = (field: string) => (fileUrl: string | null, file: File | null) => {
    setFieldValue(field, file);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* PAN Card Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                PAN Card (Mandatory)
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="PAN Number"
                  name="panNumber"
                  value={values.panNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="ABCDE1234F"
                  required
                  maxLength={10}
                  className="uppercase"
                  error={touched.panNumber && errors.panNumber ? errors.panNumber : undefined}
                />
                <p className="text-xs text-gray-500 mt-1">Format: ABCDE1234F (5 letters + 4 numbers + 1 letter)</p>

                <S3FileUpload
                  key="pan-document"
                  label="PAN Document"
                  documentType="pan"
                  required
                  showPreview={true}
                  previewHeight="h-32"
                  folderPath="kyc"
                  value={values.panDocument}
                  onChange={handleFileChange('panDocument')}
                />
              </div>
            </div>

            {/* Aadhar Card Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
                Aadhar Card (Mandatory)
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={values.aadharNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="1234 5678 9012"
                  required
                  maxLength={12}
                  error={touched.aadharNumber && errors.aadharNumber ? errors.aadharNumber : undefined}
                />
                <p className="text-xs text-gray-500 mt-1">12-digit Aadhar number</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <S3FileUpload
                    key="aadhar-front"
                    label="Aadhar Front"
                    documentType="aadhar_front"
                    required
                    showPreview={true}
                    previewHeight="h-24"
                    folderPath="kyc"
                    value={values.aadharFront}
                    onChange={handleFileChange('aadharFront')}
                  />
                  
                  <S3FileUpload
                    key="aadhar-back"
                    label="Aadhar Back"
                    documentType="aadhar_back"
                    required
                    showPreview={true}
                    previewHeight="h-24"
                    folderPath="kyc"
                    value={values.aadharBack}
                    onChange={handleFileChange('aadharBack')}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Important Information</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    PAN and Aadhar documents are mandatory for KYC verification.
                    Please ensure documents are clear, valid, and match your account details.
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">Step 1 Progress:</span>
                      <span className="text-blue-800 font-medium">
                        {[
                          values.panNumber.trim() && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber),
                          !!values.panDocument,
                          values.aadharNumber.trim() && /^[0-9]{12}$/.test(values.aadharNumber),
                          !!values.aadharFront,
                          !!values.aadharBack
                        ].filter(Boolean).length} / 5 completed
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${([
                            values.panNumber.trim() && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber),
                            !!values.panDocument,
                            values.aadharNumber.trim() && /^[0-9]{12}$/.test(values.aadharNumber),
                            !!values.aadharFront,
                            !!values.aadharBack
                          ].filter(Boolean).length / 5) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* GST Section - Optional for all users */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                GST Details (Optional)
              </h3>
            
              <div className="space-y-4">
                <Input
                  label="GST Number"
                  name="gstNumber"
                  value={values.gstNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="22ABCDE1234F1Z5"
                  maxLength={15}
                  className="uppercase"
                  error={touched.gstNumber && errors.gstNumber ? errors.gstNumber : undefined}
                />
                <p className="text-xs text-gray-500 mt-1">15-character GST number (State + PAN + Entity + Check digit)</p>

                <S3FileUpload
                  key="gst-certificate"
                  label="GST Certificate"
                  documentType="gst"
                  showPreview={true}
                  previewHeight="h-32"
                  folderPath="kyc"
                  value={values.gstDocument}
                  onChange={handleFileChange('gstDocument')}
                />
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                  {user?.role === 'agency' ? '2' : '1'}
                </span>
                Bank Details (Optional)
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Bank Account Number"
                  name="bankAccountNumber"
                  value={values.bankAccountNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="1234567890"
                  maxLength={20}
                  error={touched.bankAccountNumber && errors.bankAccountNumber ? errors.bankAccountNumber : undefined}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    name="bankName"
                    value={values.bankName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="State Bank of India"
                  />

                  <Input
                    label="IFSC Code"
                    name="bankIfsc"
                    value={values.bankIfsc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="SBIN0001234"
                    maxLength={11}
                    className="uppercase"
                    error={touched.bankIfsc && errors.bankIfsc ? errors.bankIfsc : undefined}
                  />
                </div>

                <S3FileUpload
                  key="bank-document"
                  label="Bank Statement/Cancelled Cheque"
                  documentType="bank"
                  showPreview={true}
                  previewHeight="h-32"
                  folderPath="kyc"
                  value={values.bankDocument}
                  onChange={handleFileChange('bankDocument')}
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Optional Information</h4>
                  <p className="text-sm text-green-800 mt-1">
                    GST and Bank details are optional but recommended for faster processing and better service.
                    You can skip these sections if not applicable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show toast for rejected documents (only once)
  useEffect(() => {
    if (hasRejectedDocuments && rejectedDocumentsList.length > 0 && !hasShownRejectedToastRef.current) {
      hasShownRejectedToastRef.current = true;
      toast.error(
        `The following documents need to be updated: ${rejectedDocumentsList.join(', ')}`,
        { duration: 6000 }
      );
    }
    
    // Reset the ref if documents are no longer rejected (e.g., after update)
    if (!hasRejectedDocuments) {
      hasShownRejectedToastRef.current = false;
    }
  }, [hasRejectedDocuments, rejectedDocumentsList]);

  // If documents exist, show status message instead of form (unless rejected)
  if (isLoadingDocuments) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // If documents exist and all documents are pending (not rejected), show status message
  // If documents exist and no rejected documents, show status message
  // If status is pending but has rejected documents, show form to update
  if (hasDocuments && kycDocument && (allDocumentsPending || (!hasRejectedDocuments && kycDocument.status !== 'rejected'))) {
    const isPending = kycDocument.status === 'pending';
    const isApproved = kycDocument.status === 'approved';

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-2">View your KYC verification status</p>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border p-8 ${
          isPending ? 'border-blue-200 bg-blue-50' :
          isApproved ? 'border-green-200 bg-green-50' :
          'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isPending ? 'bg-blue-100' :
              isApproved ? 'bg-green-100' :
              'bg-yellow-100'
            }`}>
              {isPending ? (
                <Clock className="w-6 h-6 text-blue-600" />
              ) : isApproved ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <h2 className={`text-xl font-semibold ${
                isPending ? 'text-blue-900' :
                isApproved ? 'text-green-900' :
                'text-yellow-900'
              }`}>
                {isPending ? 'KYC Verification Pending' :
                 isApproved ? 'KYC Verification Approved' :
                 'KYC Verification Rejected'}
              </h2>
              <p className={`mt-2 text-sm ${
                isPending ? 'text-blue-700' :
                isApproved ? 'text-green-700' :
                'text-yellow-700'
              }`}>
                {isPending 
                  ? allDocumentsPending
                    ? 'Your KYC verification is currently under review. All your documents are being processed by our team. Please wait for approval.'
                    : 'Your KYC verification is currently under review. Our team is processing your documents. Please wait for approval.'
                  : isApproved
                  ? 'Your KYC verification has been successfully approved. You now have access to all features.'
                  : 'Your KYC verification has been rejected. Please update your documents and resubmit.'}
              </p>
              <div className="mt-4 text-xs text-gray-600">
                Submitted: {new Date(kycDocument.createdAt).toLocaleDateString()}
                {kycDocument.updatedAt && kycDocument.updatedAt !== kycDocument.createdAt && (
                  <span className="ml-4">Updated: {new Date(kycDocument.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-gray-600 mt-2">Complete your identity verification to access all features</p>
        
        {/* Rejected Documents Warning */}
        {hasRejectedDocuments && rejectedDocumentsList.length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-900 mb-1">
                  Documents Requiring Update
                </h3>
                <p className="text-sm text-red-700">
                  {rejectedDocumentsList.length === 1 
                    ? `Your ${rejectedDocumentsList[0]} has been rejected and needs to be updated.`
                    : `The following documents have been rejected and need to be updated: ${rejectedDocumentsList.join(' and ')}.`
                  }
                  {' '}Please review and resubmit the required documents.
                </p>
                {kycDocument && kycDocument.status === 'pending' && (
                  <p className="text-xs text-red-600 mt-2">
                    Note: Your overall KYC status is pending, but some documents were rejected. Please update the rejected documents to proceed.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* User Information Display */}
        {user && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Name:</span>
                <span className="text-blue-800 ml-2">{user.name}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Email:</span>
                <span className="text-blue-800 ml-2">{user.email}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Phone:</span>
                <span className="text-blue-800 ml-2">{user.phonenumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <FormWrapper 
        onSubmit={(e) => {
          e.preventDefault();
          console.log('🔄 FORM SUBMIT TRIGGERED - Current Step:', currentStep);
          console.log('🔄 FORM SUBMIT TRIGGERED - Event:', e);
          
          // Only allow form submission on the final step
          if (currentStep !== 2) {
            console.log('🚫 BLOCKING FORM SUBMISSION - Not on final step');
            return;
          }
          
          if (!hasSubmittedRef.current && !isSubmittingRef.current && !isSubmittingForm && !isSubmitting) {
            console.log('✅ ALLOWING FORM SUBMISSION');
            formik.handleSubmit(e);
          } else {
            console.log('🚫 BLOCKING FORM SUBMISSION - Already submitted or in progress');
          }
        }} 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        {renderStepContent()}
      </FormWrapper>

      {/* Navigation Buttons - Outside Form */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePrevious(e);
          }}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {currentStep < 2 ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNext(e);
            }}
            className={`px-6 py-2 rounded-lg transition-colors ${
              // Check if current step is valid
              (currentStep === 1 && (
                !values.panNumber.trim() || 
                !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber) ||
                !values.panDocument ||
                !values.aadharNumber.trim() ||
                !/^[0-9]{12}$/.test(values.aadharNumber) ||
                !values.aadharFront ||
                !values.aadharBack
              ))
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-light'
            }`}
            disabled={
              currentStep === 1 && (
                !values.panNumber.trim() || 
                !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber) ||
                !values.panDocument ||
                !values.aadharNumber.trim() ||
                !/^[0-9]{12}$/.test(values.aadharNumber) ||
                !values.aadharFront ||
                !values.aadharBack
              )
            }
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🔄 SUBMIT BUTTON CLICKED');
              // Manually trigger form submission
              const formEvent = new Event('submit', { bubbles: true, cancelable: true });
              const formElement = document.querySelector('form');
              if (formElement) {
                formElement.dispatchEvent(formEvent);
              }
            }}
            disabled={hasSubmittedRef.current || (isSubmitting && !isUpdating) || (isUpdating && !isSubmitting) || isSubmittingForm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {hasSubmittedRef.current ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {hasRejectedDocuments ? 'Updated' : 'Submitted'}
              </>
            ) : (isSubmitting || isUpdating || isSubmittingForm) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSubmittingForm ? 'Uploading files...' : (hasRejectedDocuments ? 'Updating KYC...' : 'Submitting KYC...')}
              </>
            ) : (
              hasRejectedDocuments ? 'Update KYC' : 'Submit KYC'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default KYCPage;
