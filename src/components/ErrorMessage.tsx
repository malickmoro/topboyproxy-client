import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="mb-4">
        <div className="mx-auto w-16 h-16 bg-error-100 dark:bg-error-900 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-error-600 dark:text-error-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 