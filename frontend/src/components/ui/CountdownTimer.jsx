import React, { useState, useEffect } from "react";
import { Timer, Zap } from "lucide-react";

const CountdownTimer = ({ eventDate, eventTime, variant = "default", className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Parse event date and time
      const eventDateTime = new Date(eventDate);
      
      // If eventTime is provided (format: "HH:MM" or "HH:MM AM/PM"), parse it
      if (eventTime) {
        const timeParts = eventTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeParts) {
          let hours = parseInt(timeParts[1], 10);
          const minutes = parseInt(timeParts[2], 10);
          const meridiem = timeParts[3];

          if (meridiem) {
            if (meridiem.toUpperCase() === "PM" && hours !== 12) {
              hours += 12;
            } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
              hours = 0;
            }
          }

          eventDateTime.setHours(hours, minutes, 0, 0);
        }
      }

      const now = new Date();
      const difference = eventDateTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      if (!time) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-2 bg-ni-neon text-ni-black px-4 py-2 font-black uppercase border-2 border-ni-black ${className}`}>
        <Zap size={18} className="animate-pulse" />
        <span>Event Started!</span>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className={`inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 font-bold border-2 border-ni-black ${className}`}>
        <Timer size={18} />
        <span>Loading...</span>
      </div>
    );
  }

  // Compact variant for cards
  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 bg-ni-black text-ni-white px-3 py-1.5 font-bold text-sm border-2 border-ni-black ${className}`}>
        <Timer size={14} />
        {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
        <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
        <span className="text-ni-neon">{String(timeLeft.seconds).padStart(2, "0")}s</span>
      </div>
    );
  }

  // Mini variant for inline display
  if (variant === "mini") {
    return (
      <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${className}`}>
        <Timer size={12} />
        <span>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  // Default full variant
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Timer size={20} className="text-ni-black" />
        <span className="font-black uppercase text-sm tracking-wider">Starts In</span>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <TimeBlock value={timeLeft.days} label="Days" color="bg-ni-black" textColor="text-ni-white" />
        <TimeBlock value={timeLeft.hours} label="Hours" color="bg-ni-pink" />
        <TimeBlock value={timeLeft.minutes} label="Mins" color="bg-ni-cyan" />
        <TimeBlock value={timeLeft.seconds} label="Secs" color="bg-ni-neon" isAnimated />
      </div>
    </div>
  );
};

const TimeBlock = ({ value, label, color = "bg-gray-100", textColor = "text-ni-black", isAnimated = false }) => {
  return (
    <div className="flex-1 text-center">
      <div
        className={`${color} ${textColor} border-2 border-ni-black p-2 sm:p-3 font-black text-xl sm:text-3xl shadow-brutal-sm ${
          isAnimated ? "animate-pulse" : ""
        }`}
      >
        {String(value).padStart(2, "0")}
      </div>
      <p className="font-bold uppercase text-[10px] sm:text-xs mt-1 tracking-wider text-gray-600">
        {label}
      </p>
    </div>
  );
};

export default CountdownTimer;
