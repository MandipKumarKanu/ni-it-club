import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const baseStyles = "font-bold py-3 px-6 border-3 border-ni-black transition-all duration-200 cursor-pointer flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-ni-neon text-ni-black shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none",
    secondary: "bg-ni-white text-ni-black shadow-brutal hover:bg-ni-gray hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none",
    outline: "bg-transparent text-ni-black border-ni-black hover:bg-ni-black hover:text-ni-white",
    danger: "bg-ni-red text-white shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none"
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
