import React from "react";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`${sizes[size]} border-ni-black border-t-ni-neon rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const CardSkeleton = ({ className = "" }) => (
  <div
    className={`bg-ni-white border-4 border-ni-black shadow-brutal animate-pulse ${className}`}
    aria-hidden="true"
  >
    <div className="h-2 bg-gray-300" />
    <div className="p-6">
      <div className="h-6 bg-gray-300 w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 w-full mb-2" />
      <div className="h-4 bg-gray-200 w-5/6 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-300" />
        <div className="h-6 w-20 bg-gray-300" />
      </div>
      <div className="h-10 bg-gray-300 w-full" />
    </div>
  </div>
);

export const EventCardSkeleton = () => (
  <div
    className="bg-ni-white border-4 border-ni-black shadow-brutal animate-pulse"
    aria-hidden="true"
  >
    <div className="h-2 bg-gray-300" />
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <div className="w-16 h-16 bg-gray-300 border-3 border-ni-black" />
        <div className="w-20 h-6 bg-gray-300" />
      </div>
      <div className="h-6 bg-gray-300 w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 w-full mb-2" />
      <div className="h-4 bg-gray-200 w-4/5 mb-4" />
      <div className="flex gap-4 mb-5">
        <div className="h-4 w-20 bg-gray-200" />
        <div className="h-4 w-24 bg-gray-200" />
      </div>
      <div className="h-12 bg-gray-300 w-full" />
    </div>
  </div>
);

export const TeamMemberSkeleton = () => (
  <div className="relative" aria-hidden="true">
    <div className="absolute inset-0 bg-ni-black transform translate-x-4 translate-y-4 border-brutal" />
    <div className="relative z-10 bg-ni-white border-4 border-ni-black p-6 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-ni-black mx-auto mb-6" />
      <div className="h-6 bg-gray-300 w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-gray-200 w-1/2 mx-auto mb-4" />
      <div className="flex justify-center gap-2 mb-6">
        <div className="h-6 w-16 bg-gray-300" />
        <div className="h-6 w-20 bg-gray-300" />
      </div>
      <div className="flex justify-center gap-4">
        <div className="w-10 h-10 bg-gray-300 border-2 border-ni-black" />
        <div className="w-10 h-10 bg-gray-300 border-2 border-ni-black" />
        <div className="w-10 h-10 bg-gray-300 border-2 border-ni-black" />
      </div>
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div
    className="bg-ni-white border-4 border-ni-black shadow-brutal animate-pulse"
    aria-hidden="true"
  >
    <div className="h-2 bg-gray-300" />
    <div className="h-48 bg-gray-200" />
    <div className="p-4 bg-gray-300">
      <div className="h-4 bg-gray-400 w-3/4" />
    </div>
  </div>
);

export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`animate-pulse ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 mb-2 ${
          i === lines - 1 ? "w-3/4" : "w-full"
        }`}
      />
    ))}
  </div>
);

export const PageLoader = ({ message = "Loading..." }) => (
  <div
    className="min-h-[60vh] flex flex-col items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <Spinner size="xl" className="mb-6" />
    <p className="font-bold text-xl text-gray-600">{message}</p>
  </div>
);

export const ButtonLoader = ({ children, isLoading, ...props }) => (
  <button {...props} disabled={isLoading}>
    {isLoading ? (
      <span className="flex items-center gap-2">
        <Spinner size="sm" />
        Loading...
      </span>
    ) : (
      children
    )}
  </button>
);

export const FeaturedEventSkeleton = () => (
  <div
    className="bg-ni-white border-4 border-ni-black animate-pulse"
    aria-hidden="true"
  >
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="bg-gray-300 p-12 flex flex-col items-center justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-ni-black">
        <div className="h-32 w-24 bg-gray-400 mb-4" />
        <div className="h-8 w-20 bg-gray-400" />
      </div>
      <div className="lg:col-span-2 p-12">
        <div className="flex gap-4 mb-6">
          <div className="h-8 w-24 bg-gray-300" />
          <div className="h-8 w-32 bg-gray-200" />
        </div>
        <div className="h-12 bg-gray-300 w-3/4 mb-4" />
        <div className="h-6 bg-gray-200 w-full mb-2" />
        <div className="h-6 bg-gray-200 w-5/6 mb-8" />
        <div className="flex gap-4">
          <div className="h-14 w-40 bg-gray-300" />
          <div className="h-14 w-32 bg-gray-200" />
        </div>
      </div>
    </div>
  </div>
);

export default {
  Spinner,
  CardSkeleton,
  EventCardSkeleton,
  TeamMemberSkeleton,
  GallerySkeleton,
  TextSkeleton,
  PageLoader,
  ButtonLoader,
  FeaturedEventSkeleton,
};
