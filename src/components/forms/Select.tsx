import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number }[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, className, required, placeholder, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
          error ? "border-red-500" : "border-gray-300"
        } ${className ?? ""}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default Select;
