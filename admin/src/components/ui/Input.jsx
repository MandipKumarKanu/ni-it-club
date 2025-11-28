import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-bold text-sm">{label}</label>}
      <input
        ref={ref}
        className={twMerge(
          "px-4 py-2 border-brutal focus:outline-none focus:ring-2 focus:ring-ni-neon transition-all",
          "bg-white",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-xs font-bold">{error.message}</span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
