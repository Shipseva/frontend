import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ selected, onChange, className }) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className ?? ""}`}
    />
  );
};

export default DatePicker;
