import React from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Radio: React.FC<RadioProps> = ({ label, className, ...props }) => {
  return (
    <label className={`flex items-center space-x-2 ${className ?? ""}`}>
      <input type="radio" className="form-radio" {...props} />
      <span>{label}</span>
    </label>
  );
};

export default Radio;
