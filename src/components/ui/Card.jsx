import React from "react";

const Card = ({
  children,
  className = "",
  hoverEffect = false,
  rotate = 0,
}) => {
  const baseStyles = "bg-ni-white border-brutal p-6 relative";
  const hoverStyles = hoverEffect
    ? "transition-all duration-300 hover:-translate-y-2 hover:shadow-brutal-lg hover:rotate-1"
    : "shadow-brutal";
  const rotationStyle = rotate ? { transform: `rotate(${rotate}deg)` } : {};

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      style={rotationStyle}
    >
      {children}
    </div>
  );
};

export default Card;
