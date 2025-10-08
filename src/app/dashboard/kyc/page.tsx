"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Building2 } from 'lucide-react';
import { RootState } from '@/store';
import Input from '@/components/forms/Input';
import FileUpload from '@/components/forms/FileUpload';
import FormWrapper from '@/components/forms/FormWrapper';
import { useForm } from '@/components/forms/useForm';
import { panValidator, aadharValidator, gstValidator, ifscValidator, accountNumberValidator } from '@/components/forms/validators';
import * as Yup from 'yup';

const KYCPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  // Define initial values
  const initialValues = {
    // PAN Card (Mandatory)
    panNumber: '',
    panDocument: null as File | null,
    // Aadhar Card (Mandatory)
    aadharNumber: '',
    aadharFront: null as File | null,
    aadharBack: null as File | null,
    // GST (Optional)
    gstNumber: '',
    gstDocument: null as File | null,
    // Bank Details (Optional)
    bankAccountNumber: '',
    bankName: '',
    bankIfsc: '',
    bankDocument: null as File | null,
  };

  const handleSubmit = (formValues: typeof initialValues) => {
    // TODO: Implement KYC submission
    console.log('KYC Data:', formValues);
    alert('KYC submitted successfully! Your documents are under review.');
    router.push('/dashboard');
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

  const { values, errors, touched, setFieldValue, setFieldError } = formik;

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
        alert('Please complete all required fields:\n\n' + errors.join('\n'));
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // File change handlers
  const handleFileChange = (field: string) => (file: File | null, previewUrl: string | null) => {
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

                <FileUpload
                  label="PAN Document"
                  id="panDocument"
                  accept="image/*,.pdf"
                  required
                  showPreview={true}
                  previewHeight="h-32"
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
                  <FileUpload
                    label="Aadhar Front"
                    id="aadharFront"
                    accept="image/*"
                    required
                    showPreview={true}
                    previewHeight="h-24"
                    onChange={handleFileChange('aadharFront')}
                  />
                  
                  <FileUpload
                    label="Aadhar Back"
                    id="aadharBack"
                    accept="image/*"
                    required
                    showPreview={true}
                    previewHeight="h-24"
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

                <FileUpload
                  label="GST Certificate"
                  id="gstDocument"
                  accept="image/*,.pdf"
                  showPreview={true}
                  previewHeight="h-32"
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

                <FileUpload
                  label="Bank Statement/Cancelled Cheque"
                  id="bankDocument"
                  accept="image/*,.pdf"
                  showPreview={true}
                  previewHeight="h-32"
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
      <FormWrapper onSubmit={formik.handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
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
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit KYC
            </button>
          )}
        </div>
      </FormWrapper>
    </div>
  );
};

export default KYCPage;
