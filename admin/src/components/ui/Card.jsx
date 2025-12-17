import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = "bg-white rounded-xl shadow-sm border border-slate-100";
  const hoverClasses = hover ? "hover:shadow-md transition-shadow duration-200" : "";
  const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pt-4 border-t border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };
