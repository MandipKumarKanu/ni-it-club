import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const Button = ({ children, className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-ni-neon hover:bg-ni-pink text-black",
    secondary: "bg-ni-cyan hover:bg-ni-blue text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "bg-transparent hover:bg-gray-200 text-black",
  };

  return (
    <button
      className={twMerge(
        clsx(
          "px-6 py-2 font-bold transition-all duration-200",
          "border-brutal shadow-brutal active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
