import { twMerge } from "tailwind-merge";

const Card = ({ children, className, title, action }) => {
  return (
    <div
      className={twMerge("bg-white border-brutal shadow-brutal p-6", className)}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
