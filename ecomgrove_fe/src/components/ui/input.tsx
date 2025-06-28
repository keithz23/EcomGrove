import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = {
  id: string;
  label: string;
  type: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, type, label, className, onChange, defaultValue, ...props }, ref) => {
    const [hasValue, setHasValue] = React.useState(() =>
      typeof defaultValue === "string" ? defaultValue.length > 0 : false
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          placeholder=" "
          ref={ref}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "peer w-full border border-gray-300 px-3 pt-5 pb-2 text-sm focus:border-mid-night focus:outline-none selection:bg-mid-night selection:text-white",
            className
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 top-2 z-10 text-soft-gray text-md bg-white px-1 transition-all",
            "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
            "peer-focus:top-[-9px] peer-focus:text-sm peer-focus:text-black",
            hasValue && "top-[-9px] text-sm text-black"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
