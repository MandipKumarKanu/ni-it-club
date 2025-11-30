import clsx from "clsx";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200 border-2 border-black",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
