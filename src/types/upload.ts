// Upload types for S3 integration

export interface PreSignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string; // Made generic - can be any string
  folderPath?: string; // Optional custom folder path (e.g., 'kyc', 'profile', 'products')
}

export interface PreSignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  expiresIn: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export interface FileUploadState {
  file: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadedUrl: string | null;
}

export type DocumentType = string; // Made generic - can be any string

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions: string[];
}
