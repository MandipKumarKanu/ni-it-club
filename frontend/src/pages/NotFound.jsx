import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import { Binary, Dots } from "../components/ui/Doodles";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] relative overflow-hidden flex items-center justify-center px-4">
      {/* Background Decorations */}
      <Binary className="absolute top-10 left-10 text-ni-black opacity-5 scale-150" />
      <Binary className="absolute bottom-10 right-10 text-ni-black opacity-5 scale-150" />
      <Dots className="absolute top-1/4 right-1/4 w-32 h-32 text-ni-pink opacity-10" />

      <div className="text-center relative z-10 max-w-2xl">
        {/* Glitch-style 404 */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] sm:text-[16rem] font-black leading-none text-ni-black select-none">
            <span className="relative inline-block">
              4
              <span className="absolute inset-0 text-ni-cyan opacity-50 animate-pulse -translate-x-2">
                4
              </span>
            </span>
            <span className="relative inline-block text-ni-neon">
              0
              <span className="absolute inset-0 text-ni-pink opacity-50 animate-pulse translate-x-2">
                0
              </span>
            </span>
            <span className="relative inline-block">
              4
              <span className="absolute inset-0 text-ni-cyan opacity-50 animate-pulse -translate-x-2">
                4
              </span>
            </span>
          </h1>
        </div>

        {/* Error Card */}
        <div className="bg-ni-white border-4 border-ni-black shadow-brutal p-8 mb-8 transform -rotate-1">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-ni-pink" strokeWidth={3} />
            <h2 className="text-3xl sm:text-4xl font-black uppercase">
              Page Not Found
            </h2>
          </div>
          <p className="text-lg font-bold text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="font-mono text-sm text-gray-500 bg-gray-100 inline-block px-3 py-1 border-2 border-ni-black">
            Error Code: 404_PAGE_NOT_FOUND
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" className="w-full sm:w-auto text-lg">
              <Home size={20} strokeWidth={3} />
              Go Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-ni-white text-ni-black border-4 border-ni-black px-6 py-3 font-bold flex items-center justify-center gap-2 shadow-brutal hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={20} strokeWidth={3} />
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-ni-black text-ni-white border-4 border-ni-black px-6 py-3 font-bold flex items-center justify-center gap-2 shadow-brutal hover:bg-gray-800 transition-all"
          >
            <RefreshCw size={20} strokeWidth={3} />
            Retry
          </button>
        </div>

        {/* Fun Message */}
        <p className="mt-12 text-gray-500 font-bold">
          Lost in the code? Don't worry, even the best developers get 404'd
          sometimes! 🤓
        </p>
      </div>
    </div>
  );
};

export default NotFound;
