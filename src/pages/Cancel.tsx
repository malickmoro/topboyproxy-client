import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cancel: React.FC = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* PIA Logo */}
        <div className="mb-6">
          <img 
            src="/pia.jpg" 
            alt="PIA - Private Internet Access" 
            className="mx-auto h-16 w-auto object-contain dark:hidden"
          />
          <img 
            src="/pia.png" 
            alt="PIA - Private Internet Access" 
            className="mx-auto h-16 w-auto object-contain hidden dark:block"
          />
        </div>
        
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-error-100 dark:bg-error-900 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-error-600 dark:text-error-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your payment was not completed
          </p>
        </div>

        {/* Cancel Details */}
        <div className="card mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              What Happened?
            </h2>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-error-500 dark:text-error-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Payment was cancelled or failed</span>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-error-500 dark:text-error-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">No charges were made to your account</span>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-error-500 dark:text-error-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">You can try again anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="card mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
            Common Issues
          </h3>
          <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
            <p>• Insufficient funds in your account</p>
            <p>• Network connectivity problems</p>
            <p>• Payment method not supported</p>
            <p>• Transaction timeout</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="btn-primary w-full"
          >
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/', { replace: true })}
            className="btn-secondary w-full"
          >
            Back to Categories
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Still having issues?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Contact us at{' '}
            <a href="mailto:support@topboy.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              support@topboy.com
            </a>
            {' '}or call{' '}
            <a href="tel:+233508055245" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              +233508055245
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cancel; 