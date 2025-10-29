import React from "react";

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const Switch: React.FC<SwitchProps> = ({ ...props }) => {
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" {...props} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all" />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-all" />
    </label>
  );
};

export default Switch;
