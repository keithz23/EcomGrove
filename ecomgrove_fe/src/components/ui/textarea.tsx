import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, value, defaultValue, ...props }, ref) => {
    const [hasValue, setHasValue] = React.useState(
      Boolean(value ?? defaultValue)
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          id={id}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder=" "
          className={cn(
            "peer w-full border border-gray-300 px-3 pt-5 pb-2 text-sm focus:border-mid-night focus:outline-none selection:bg-mid-night selection:text-white",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-3 top-2 z-10 bg-white px-1 text-md text-soft-gray transition-all",
              "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
              "peer-focus:top-[-9px] peer-focus:text-sm peer-focus:text-black",
              hasValue && "top-[-9px] text-sm text-black"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
