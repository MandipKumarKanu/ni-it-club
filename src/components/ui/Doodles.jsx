import React from "react";

export const CurlyBrace = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 50 100"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M45 5 C 20 5, 20 30, 15 45 C 10 50, 5 50, 5 50 C 5 50, 10 50, 15 55 C 20 70, 20 95, 45 95" />
  </svg>
);

export const AngleBracket = ({
  className,
  color = "currentColor",
  direction = "left",
}) => (
  <svg
    viewBox="0 0 50 100"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d={direction === "left" ? "M40 10 L10 50 L40 90" : "M10 10 L40 50 L10 90"}
    />
  </svg>
);

export const Arrow = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 100 50"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 25 L90 25 M70 10 L95 25 L70 40" />
  </svg>
);

export const HandDrawnArrow = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 100 60"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 30 Q 50 10, 90 30 M 70 15 L 90 30 L 75 45" />
  </svg>
);

export const Zigzag = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 200 40"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 20 L25 5 L45 35 L65 5 L85 35 L105 5 L125 35 L145 5 L165 35 L185 5" />
  </svg>
);

export const WavyLine = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 200 40"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 20 Q 30 5, 55 20 T 105 20 T 155 20 T 195 20" />
  </svg>
);

export const Binary = ({ className, color = "currentColor" }) => (
  <div
    className={`font-mono font-bold text-xs tracking-widest opacity-50 ${className}`}
    style={{ color }}
  >
    1010011010
    <br />
    0110100101
  </div>
);

export const Chip = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 60 60"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="3"
  >
    <rect x="10" y="10" width="40" height="40" rx="4" />
    <path d="M10 20 H2 M10 30 H2 M10 40 H2 M50 20 H58 M50 30 H58 M50 40 H58 M20 10 V2 M30 10 V2 M40 10 V2 M20 50 V58 M30 50 V58 M40 50 V58" />
  </svg>
);

export const Dots = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} fill={color}>
    <circle cx="10" cy="10" r="4" /> <circle cx="30" cy="10" r="4" />{" "}
    <circle cx="50" cy="10" r="4" />
    <circle cx="10" cy="30" r="4" /> <circle cx="30" cy="30" r="4" />{" "}
    <circle cx="50" cy="30" r="4" />
    <circle cx="10" cy="50" r="4" /> <circle cx="30" cy="50" r="4" />{" "}
    <circle cx="50" cy="50" r="4" />
  </svg>
);

export const CircleScribble = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
  >
    <path d="M50 10 C 20 10, 10 30, 10 50 C 10 80, 30 90, 50 90 C 80 90, 90 70, 90 50 C 90 20, 70 10, 50 10 C 40 10, 35 15, 35 20" />
  </svg>
);

export const Star = ({ className, color = "currentColor" }) => (
  <svg
    viewBox="0 0 50 50"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M25 2 L31 18 L48 18 L34 28 L39 44 L25 34 L11 44 L16 28 L2 18 L19 18 Z" />
  </svg>
);
