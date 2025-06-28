interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
  fullscreen?: boolean;
}
export const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  color = "indigo",
  fullscreen = false,
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  const colorClasses = {
    indigo: "border-indigo-600",
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
  };

  return (
    <div
      className={`
      flex items-center justify-center
      ${fullscreen ? "fixed inset-0 bg-white bg-opacity-80 z-50" : ""}
    `}
    >
      <div
        className={`
        ${sizeClasses[size]}
        border-4
        ${colorClasses[color as keyof typeof colorClasses]}
        border-t-transparent
        rounded-full
        animate-spin
      `}
      ></div>
    </div>
  );
};
