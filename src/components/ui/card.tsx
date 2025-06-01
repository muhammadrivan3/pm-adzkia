import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 border-b border-gray-200">{children}</div>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>;
};

export const CardTitle = ({ children , className = ''}: CardProps ) => {
  return (
    <h2 className="text-xl font-semibold text-gray-800 text-center">
      {children}
    </h2>
  );
};
