import React, { ReactNode } from "react";

interface FormWrapperProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ children, onSubmit, className }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className ?? ""}`}>
      {children}
    </form>
  );
};

export default FormWrapper;
