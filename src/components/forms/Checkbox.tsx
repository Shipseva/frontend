import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className={`flex items-center space-x-2 ${className ?? ""}`}>
      <input type="checkbox" className="form-checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
