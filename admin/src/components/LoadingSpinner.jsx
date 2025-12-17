import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 
        className={`animate-spin text-emerald-600 ${sizeClasses[size]}`}
      />
      {text && <span className="text-slate-600 text-sm">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
