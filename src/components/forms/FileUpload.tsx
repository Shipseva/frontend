import React, { useState, useEffect } from "react";
import { Upload, CheckCircle, X } from "lucide-react";

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  required?: boolean;
  showPreview?: boolean;
  previewHeight?: string;
  onChange?: (file: File | null, previewUrl: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  error, 
  required, 
  showPreview = false, 
  previewHeight = "h-32",
  onChange,
  className, 
  ...props 
}) => {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFileName(file.name);
      
      if (showPreview && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onChange?.(file, url);
      } else {
        setPreviewUrl(null);
        onChange?.(file, null);
      }
    } else {
      setFileName("");
      setPreviewUrl(null);
      onChange?.(null, null);
    }
  };

  const handleRemove = () => {
    setFileName("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onChange?.(null, null);
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
        error ? 'border-red-300' : 'border-gray-300'
      }`}>
        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview"
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
            <p className="text-sm text-green-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {fileName}
            </p>
            <label
              htmlFor={props.id}
              className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Change File
            </label>
          </div>
        ) : (
          <div>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload {label || 'File'}</p>
            <input
              type="file"
              className="hidden"
              {...props}
              onChange={handleChange}
            />
            <label
              htmlFor={props.id}
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-light transition-colors"
            >
              Choose File
            </label>
          </div>
        )}
      </div>
      
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default FileUpload;
