import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';
import { getApiUrl } from "@/config/apiConfig";

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

export interface UserKYCDocument {
  id: string;
  aadhar: {
    aadharBack: string;
    aadharFront: string;
    aadharNumber: string;
    documentStatus: 'pending' | 'verified' | 'rejected';
  };
  pan: {
    panBack: string;
    panFront: string;
    panNumber: string;
    documentStatus: 'pending' | 'verified' | 'rejected';
  };
  ifsc?: string;
  accountNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  gstNumber?: string;
  gstCertificate?: string;
  businessType: 'individual' | 'business';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateKYCData {
  aadhar?: {
    aadharNumber?: string;
    aadharFront?: string;
    aadharBack?: string;
    documentStatus?: 'pending' | 'verified' | 'rejected';
  };
  pan?: {
    panNumber?: string;
    panFront?: string;
    panBack?: string;
    documentStatus?: 'pending' | 'verified' | 'rejected';
  };
  ifsc?: string;
  accountNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  gstNumber?: string;
  gstCertificate?: string;
  businessType?: 'individual' | 'business';
}

export interface UpdateKYCResponse {
  success: boolean;
  message: string;
  data?: UserKYCDocument;
}

export const kycApi = createApi({
  reducerPath: 'kycApi',
  baseQuery: createBaseQueryWithToasts(getApiUrl("KYC")),
  endpoints: (builder) => ({
    submitKYC: builder.mutation<KYCResponse, KYCSubmissionData>({
      query: (kycData) => {
        return ({
        url: '/',
        method: 'POST',
        body: kycData,
      })},
    }),
    getKYCStatus: builder.query<KYCResponse, void>({
      query: () => '/status',
    }),
    getUserDocuments: builder.query<UserKYCDocument[], void>({
      query: () => '/userDocuments',
    }),
    updateKYC: builder.mutation<UpdateKYCResponse, { id: string; data: UpdateKYCData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useSubmitKYCMutation,
  useGetKYCStatusQuery,
  useGetUserDocumentsQuery,
  useUpdateKYCMutation,
} = kycApi;
