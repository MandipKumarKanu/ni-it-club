import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "font-bold py-3 px-6 border-brutal transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover-wiggle active:translate-y-1 active:shadow-none";

  const variants = {
    primary: "bg-ni-neon text-ni-black shadow-brutal hover:bg-ni-cyan",
    secondary:
      "bg-ni-white text-ni-black shadow-brutal hover:bg-ni-pink hover:text-ni-white",
    outline:
      "bg-transparent text-ni-black border-brutal hover:bg-ni-black hover:text-ni-white shadow-brutal-sm",
    danger: "bg-ni-red text-white shadow-brutal hover:bg-ni-black",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
