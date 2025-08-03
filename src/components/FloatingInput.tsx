import React, { forwardRef } from "react";

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, containerClassName = "mb-4 relative", inputClassName = "peer w-full border rounded px-2 pt-5 pb-1 bg-transparent focus:outline-none focus:border-blue-500 h-[42px]", ...props }, ref) => {
    return (
      <div className={containerClassName}>
        <input
          {...props}
          className={inputClassName}
          placeholder=" "
          autoComplete="off"
          ref={ref}
        />
        <label
          htmlFor={props.id}
          className={
            "absolute left-2 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-focus:text-blue-600 peer-focus:top-0 peer-focus:text-xs " +
            (props.value ? "top-0 text-xs" : "top-5 text-xs")
          }
        >
          {label}
        </label>
      </div>
    );
  }
);

export default FloatingInput;
