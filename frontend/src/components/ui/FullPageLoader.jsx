import React, { useState, useEffect } from "react";

const FullPageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
    };
  }, []);

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-ni-white z-50 overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-ni-neon rounded-full animate-float opacity-60"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-ni-pink rounded-full animate-float-delayed opacity-60"></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-ni-cyan rounded-full animate-float opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-ni-blue rounded-full animate-float-delayed opacity-60"></div>

      {/* Main Container */}
      <div className="relative h-full flex flex-col items-center justify-center gap-16 px-4">
        {/* Logo with Circular Progress */}
        <div className="relative">
          {/* SVG Progress Ring */}
          <svg
            className="absolute inset-0 -m-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)]"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="120"
              stroke="#000"
              strokeWidth="3"
              fill="none"
              opacity="0.1"
            />
            {/* Progress Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="120"
              stroke="#ccff00"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>

          {/* Logo Container */}
          <div className="relative">
            {/* Shadow */}
            <div className="absolute inset-0 transform translate-x-3 translate-y-3 bg-ni-black border-brutal w-56 h-56 md:w-72 md:h-72"></div>

            {/* Main Logo Box */}
            <div className="relative bg-ni-white border-brutal w-56 h-56 md:w-72 md:h-72 shadow-brutal-lg flex items-center justify-center p-10 overflow-hidden">
              {/* Rotating Border Effect */}
              {/* <div className="absolute inset-0 border-4 border-transparent border-t-ni-neon border-r-ni-pink animate-spin-slow opacity-50"></div> */}

              {/* Logo */}
              <img
                src="/niit-c.png"
                alt="NI IT Club"
                className="relative z-10 w-full h-full object-contain"
              />
            </div>

            {/* Corner Accents */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-ni-neon border-2 border-ni-black"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-ni-pink border-2 border-ni-black"></div>
          </div>

          {/* Percentage Badge */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-ni-black text-ni-neon border-brutal px-6 py-2 shadow-brutal">
            <span className="text-2xl font-black font-mono">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-ni-neon blur-md opacity-30"></div>
            <h2 className="relative text-4xl md:text-5xl font-black uppercase tracking-tighter">
              <span className="text-ni-black">Loading</span>
              <span className="text-ni-neon">{dots}</span>
            </h2>
          </div>

          {/* Status Message */}
          <div className="relative">
            <div className="absolute inset-0 bg-ni-black transform translate-x-1 translate-y-1"></div>
            <div className="relative bg-ni-white border-2 border-ni-black px-6 py-2">
              <p className="text-sm font-bold uppercase tracking-wider text-ni-black">
                Preparing Your Experience
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Bar */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-1 bg-ni-black"></div>
          <div className="w-3 h-3 bg-ni-neon border-2 border-ni-black rotate-45"></div>
          <div className="w-20 h-1 bg-ni-black"></div>
          <div className="w-3 h-3 bg-ni-pink border-2 border-ni-black"></div>
          <div className="w-12 h-1 bg-ni-black"></div>
        </div>
      </div>

      {/* Minimal Corner Frames */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-ni-black"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-ni-black"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-ni-black"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-ni-black"></div>
    </div>
  );
};

export default FullPageLoader;
