import { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";

const ImageWithLoader = ({ src, alt, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-ni-gray-100 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-ni-black" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-ni-gray-100 text-ni-gray-400">
          <ImageIcon size={24} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageWithLoader;
