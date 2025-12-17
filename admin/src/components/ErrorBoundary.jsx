import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

const ErrorBoundary = ({ error, resetError, children }) => {
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <Button onClick={resetError} className="mx-auto">
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
