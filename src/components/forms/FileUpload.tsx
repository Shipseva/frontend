import React, { useState } from "react";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, className, ...props }) => {
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    if (props.onChange) props.onChange(e);
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        type="file"
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className ?? ""}`}
        {...props}
        onChange={handleChange}
      />
      {fileName && <span className="text-gray-600 text-sm">{fileName}</span>}
    </div>
  );
};

export default FileUpload;
