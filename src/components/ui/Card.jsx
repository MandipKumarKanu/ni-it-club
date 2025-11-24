import React from 'react';

const Card = ({ children, className = '', hoverEffect = false }) => {
  const baseStyles = "bg-ni-white border-3 border-ni-black p-6";
  const hoverStyles = hoverEffect ? "transition-all duration-200 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#000000]" : "shadow-brutal";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
