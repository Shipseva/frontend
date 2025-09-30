import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  error?: string;
  required?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className, error, required, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className={`flex items-start space-x-2 ${className ?? ""}`}>
        <div className="flex items-center h-5">
          <input 
            type="checkbox" 
            className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
              error ? "border-red-500" : ""
            }`}
            {...props} 
          />
        </div>
        <div className="text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </div>
      </label>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default Checkbox;
