// S3 Upload utilities and services

import { 
  PreSignedUrlRequest, 
  PreSignedUrlResponse, 
  UploadProgress, 
  UploadResult, 
  FileValidationResult, 
  FileValidationOptions,
  DocumentType 
} from '@/types/upload';

// File validation utilities
export const validateFile = (
  file: File, 
  options: FileValidationOptions
): FileValidationResult => {
  // Check file size
  if (file.size > options.maxSize) {
    const maxSizeMB = Math.round(options.maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`
    };
  }

  // Check file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !options.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension .${fileExtension} is not allowed`
    };
  }

  return { isValid: true };
};

// Default validation options for KYC documents
export const getDefaultValidationOptions = (): FileValidationOptions => ({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf']
});

// Generate unique file name
export const generateFileName = (originalName: string, documentType: DocumentType): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${documentType}_${timestamp}_${randomString}.${extension}`;
};

// Get pre-signed URL from Next.js API route
export const getPreSignedUrl = async (
  request: PreSignedUrlRequest
): Promise<PreSignedUrlResponse> => {
  const response = await fetch('/api/upload/presigned-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get pre-signed URL');
  }

  return response.json();
};

// Upload file to S3 using pre-signed URL
export const uploadToS3 = async (
  file: File,
  uploadUrl: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100)
        };
        onProgress(progress);
      }
    });

    // Handle upload completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ success: true });
      } else {
        resolve({ 
          success: false, 
          error: `Upload failed with status: ${xhr.status}` 
        });
      }
    });

    // Handle upload errors
    xhr.addEventListener('error', () => {
      resolve({ 
        success: false, 
        error: 'Network error during upload' 
      });
    });

    // Handle upload abort
    xhr.addEventListener('abort', () => {
      resolve({ 
        success: false, 
        error: 'Upload was cancelled' 
      });
    });

    // Start upload
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
};

// Complete upload flow: validate -> get pre-signed URL -> upload to S3
export const uploadFile = async (
  file: File,
  documentType: DocumentType,
  onProgress?: (progress: UploadProgress) => void,
  folderPath?: string
): Promise<{ fileUrl: string }> => {
  // Validate file
  const validation = validateFile(file, getDefaultValidationOptions());
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Generate unique file name
  const fileName = generateFileName(file.name, documentType);

  // Get pre-signed URL
  const { uploadUrl, fileUrl } = await getPreSignedUrl({
    fileName,
    fileType: file.type,
    fileSize: file.size,
    documentType,
    folderPath
  });

  // Upload to S3
  const uploadResult = await uploadToS3(file, uploadUrl, onProgress);
  
  if (!uploadResult.success) {
    throw new Error(uploadResult.error || 'Upload failed');
  }

  return { fileUrl };
};

// Utility to create preview URL for images
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

// Utility to revoke preview URL
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
