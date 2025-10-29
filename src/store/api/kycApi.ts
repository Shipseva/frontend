import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';

export interface KYCDocument {
  aadharNumber: string;
  aadharFront: string;
  aadharBack: string;
  isVerified: boolean;
}

export interface PANDocument {
  panNumber: string;
  panFront: string;
  panBack: string;
  isVerified: boolean;
}

export interface KYCSubmissionData {
  aadhar: KYCDocument;
  pan: PANDocument;
  ifsc?: string;
  accountNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  gstNumber?: string;
  gstCertificate?: string;
  businessType: 'individual' | 'business';
}

export interface KYCResponse {
  success: boolean;
  message: string;
  data?: {
    kycId: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
  };
}

export const kycApi = createApi({
  reducerPath: 'kycApi',
  baseQuery: createBaseQueryWithToasts("http://localhost"),
  endpoints: (builder) => ({
    submitKYC: builder.mutation<KYCResponse, KYCSubmissionData>({
      query: (kycData) => {
        console.log('kycData', kycData);
        return ({
        url: '/kyc',
        method: 'POST',
        body: kycData,
      })},
    }),
    getKYCStatus: builder.query<KYCResponse, void>({
      query: () => '/kyc/status',
      providesTags: ['KYC'],
    }),
  }),
});

export const {
  useSubmitKYCMutation,
  useGetKYCStatusQuery,
} = kycApi;
