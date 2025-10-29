import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, CheckCircle, X, AlertCircle, Loader2 } from 'lucide-react';
import { 
  FileUploadState, 
  DocumentType, 
  UploadProgress 
} from '@/types/upload';
import { 
  uploadFile, 
  createPreviewUrl, 
  revokePreviewUrl, 
  formatFileSize,
  validateFile
} from '@/lib/upload';
import toast from 'react-hot-toast';

interface S3FileUploadProps {
  label?: string;
  documentType: DocumentType;
  error?: string;
  required?: boolean;
  showPreview?: boolean;
  previewHeight?: string;
  className?: string;
  accept?: string; // File types to accept
  maxSize?: number; // Max file size in bytes
  folderPath?: string; // Custom folder path (e.g., 'kyc', 'profile', 'products')
  value?: File | null; // Current file value from parent
  onChange?: (fileUrl: string | null, file: File | null) => void;
  onUploadStart?: () => void;
  onUploadComplete?: (fileUrl: string) => void;
  onUploadError?: (error: string) => void;
  // New props for controlled upload
  shouldUpload?: boolean; // Trigger upload when true
  onUploadProgress?: (progress: number) => void;
}

const S3FileUpload: React.FC<S3FileUploadProps> = ({
  label,
  documentType,
  error,
  required = false,
  showPreview = true,
  previewHeight = "h-32",
  className = "",
  accept = "image/*,.pdf",
  maxSize = 5 * 1024 * 1024, // 5MB default
  folderPath,
  value,
  onChange,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  shouldUpload = false,
  onUploadProgress,
}) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    uploadProgress: 0,
    uploadError: null,
    uploadedUrl: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sync internal state with value prop
  React.useEffect(() => {
    if (value && value !== uploadState.file) {
      // Create preview URL for images
      let previewUrl: string | null = null;
      if (showPreview && value.type.startsWith('image/')) {
        previewUrl = createPreviewUrl(value);
      }
      
      setUploadState(prev => ({
        ...prev,
        file: value,
        previewUrl,
        uploadError: null,
        uploadedUrl: null,
        isUploading: false,
        uploadProgress: 0,
      }));
    } else if (!value && uploadState.file) {
      // Clear state when value is null
      setUploadState(prev => ({
        ...prev,
        file: null,
        previewUrl: null,
        uploadError: null,
        uploadedUrl: null,
        isUploading: false,
        uploadProgress: 0,
      }));
    }
  }, [value, showPreview, uploadState.file]);

  // Handle controlled upload when shouldUpload becomes true
  React.useEffect(() => {
    if (shouldUpload && uploadState.file && !uploadState.uploadedUrl && !uploadState.isUploading) {
      handleUpload();
    }
  }, [shouldUpload, uploadState.file, uploadState.uploadedUrl, uploadState.isUploading, handleUpload]);

  // Upload function
  const handleUpload = useCallback(async () => {
    if (!uploadState.file) return;

    try {
      setUploadState(prev => ({ ...prev, isUploading: true, uploadProgress: 0 }));
      onUploadStart?.();

      const { fileUrl } = await uploadFile(
        uploadState.file,
        documentType,
        (progress: UploadProgress) => {
          setUploadState(prev => ({ ...prev, uploadProgress: progress.percentage }));
          onUploadProgress?.(progress.percentage);
        },
        folderPath
      );

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100,
        uploadedUrl: fileUrl,
      }));

      onChange?.(fileUrl, uploadState.file);
      onUploadComplete?.(fileUrl);
      toast.success('File uploaded successfully!');

    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Upload failed';
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        uploadError: errorMessage,
      }));
      
      onChange?.(null, null);
      onUploadError?.(errorMessage);
      toast.error(errorMessage);
    }
  }, [uploadState.file, documentType, folderPath, onChange, onUploadStart, onUploadComplete, onUploadError, onUploadProgress]);

  // Handle file selection - now just validates and stores locally
  const handleFileSelect = useCallback((file: File) => {
    // Create custom validation options
    const customValidationOptions = {
      maxSize,
      allowedTypes: accept.includes('image/*') ? ['image/jpeg', 'image/jpg', 'image/png'] : 
                   accept.includes('.pdf') ? ['application/pdf'] :
                   accept.includes('image/*') && accept.includes('.pdf') ? ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'] :
                   ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
      allowedExtensions: accept.includes('image/*') ? ['jpg', 'jpeg', 'png'] :
                        accept.includes('.pdf') ? ['pdf'] :
                        accept.includes('image/*') && accept.includes('.pdf') ? ['jpg', 'jpeg', 'png', 'pdf'] :
                        ['jpg', 'jpeg', 'png', 'pdf']
    };

    // Validate file
    const validation = validateFile(file, customValidationOptions);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    // Create preview URL for images
    let previewUrl: string | null = null;
    if (showPreview && file.type.startsWith('image/')) {
      previewUrl = createPreviewUrl(file);
    }

    // Store file locally without uploading
    setUploadState(prev => ({
      ...prev,
      file,
      previewUrl,
      uploadError: null,
      uploadedUrl: null,
      isUploading: false,
      uploadProgress: 0,
    }));

    // Notify parent component with file (no URL yet)
    onChange?.(null, file);
    // Removed toast - file selection is indicated by the preview
  }, [maxSize, accept, showPreview, onChange]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    if (uploadState.isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [uploadState.isUploading, handleFileSelect]);

  // Handle file removal
  const handleRemove = () => {
    if (uploadState.previewUrl) {
      revokePreviewUrl(uploadState.previewUrl);
    }
    
    setUploadState({
      file: null,
      previewUrl: null,
      isUploading: false,
      uploadProgress: 0,
      uploadError: null,
      uploadedUrl: null,
    });

    onChange?.(null, null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle retry upload
  const handleRetry = () => {
    if (uploadState.file) {
      handleFileSelect(uploadState.file);
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    // Convert document type to a readable label
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderUploadArea = () => {
    if (uploadState.uploadedUrl && uploadState.previewUrl) {
      return (
        <div className="space-y-3">
          <div className="relative inline-block">
            <Image
              src={uploadState.previewUrl}
              alt="Preview"
              width={300}
              height={128}
              className={`max-w-full ${previewHeight} object-contain border border-gray-200 rounded-lg`}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-green-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {uploadState.file?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {uploadState.file && formatFileSize(uploadState.file.size)}
            </p>
            <p className="text-xs text-green-600 mt-1">✓ Uploaded successfully</p>
            <label
              htmlFor={`file-input-${documentType}`}
              className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Change File
            </label>
          </div>
        </div>
      );
    }

    if (uploadState.file && uploadState.previewUrl) {
      return (
        <div className="space-y-3">
          <div className="relative inline-block">
            <Image
              src={uploadState.previewUrl}
              alt="Preview"
              width={300}
              height={128}
              className={`max-w-full ${previewHeight} object-contain border border-gray-200 rounded-lg`}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {uploadState.file?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {uploadState.file && formatFileSize(uploadState.file.size)}
            </p>
            <p className="text-xs text-blue-600 mt-1">✓ Ready for upload</p>
            <label
              htmlFor={`file-input-${documentType}`}
              className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Change File
            </label>
          </div>
        </div>
      );
    }

    if (uploadState.isUploading) {
      return (
        <div className="space-y-4">
          {uploadState.previewUrl && (
            <div className="relative inline-block">
              <Image
                src={uploadState.previewUrl}
                alt="Preview"
                width={300}
                height={128}
                className={`max-w-full ${previewHeight} object-contain border border-gray-200 rounded-lg opacity-75`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
          )}
          <div className="text-center">
            <p className="text-sm text-blue-600 flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Uploading... {uploadState.uploadProgress}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (uploadState.uploadError) {
      return (
        <div className="space-y-3">
          {uploadState.previewUrl && (
            <div className="relative inline-block">
              <Image
                src={uploadState.previewUrl}
                alt="Preview"
                width={300}
                height={128}
                className={`max-w-full ${previewHeight} object-contain border border-gray-200 rounded-lg opacity-75`}
              />
              <div className="absolute inset-0 bg-red-100 bg-opacity-75 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          )}
          <div className="text-center">
            <p className="text-sm text-red-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Upload failed
            </p>
            <p className="text-xs text-red-500 mt-1">{uploadState.uploadError}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Retry Upload
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className={`text-sm mb-2 ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`}>
          {isDragOver ? 'Drop file here' : `Upload ${getDocumentTypeLabel(documentType)}`}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Drag & drop or click to select
        </p>
        <input
          ref={fileInputRef}
          type="file"
          id={`file-input-${documentType}`}
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
          disabled={uploadState.isUploading}
        />
        <label
          htmlFor={`file-input-${documentType}`}
          className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            uploadState.isUploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isDragOver
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-primary text-white hover:bg-primary-light'
          }`}
        >
          Choose File
        </label>
        <p className="text-xs text-gray-400 mt-2">
          Max {Math.round(maxSize / (1024 * 1024))}MB • {accept.replace(/\*/g, '').replace(/,/g, ', ')}
        </p>
      </div>
    );
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          error 
            ? 'border-red-300' 
            : isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {renderUploadArea()}
      </div>
      
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default S3FileUpload;
