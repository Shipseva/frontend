import React, { ReactNode } from "react";

type TextType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

interface TextProps {
  type?: TextType;               // HTML element type
  children: ReactNode;           // text or nested elements
  className?: string;            // optional custom class
  onClick?: () => void;          // optional click handler
}

const defaultClasses: Record<TextType, string> = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-semibold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-medium",
  h5: "text-lg font-medium",
  h6: "text-base font-medium",
  p: "text-base text-gray-700",
  span: "text-base",
};

const Text: React.FC<TextProps> = ({ type = "p", children, className, onClick }) => {
  const Component = type as React.ElementType; // dynamic tag with correct type
  const appliedClass = className ? className : defaultClasses[type];

  return (
    <Component className={appliedClass} onClick={onClick}>
      {children}
    </Component>
  );
};

export default Text;
