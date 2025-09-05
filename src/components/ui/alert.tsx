import React from "react";

export const Alert = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>{children}</div>
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-blue-800 text-sm flex items-start space-x-2">{children}</div>
);