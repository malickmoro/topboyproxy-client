import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-success-600 dark:text-success-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your proxy order has been confirmed
          </p>
        </div>

        {/* Success Details */}
        <div className="card mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Confirmed
            </h2>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-success-500 dark:text-success-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Payment processed successfully</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-success-500 dark:text-success-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Order details sent to your phone</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-success-500 dark:text-success-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Proxies will be activated shortly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            What's Next?
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>• You'll receive proxy credentials via SMS</p>
            <p>• Proxies will be ready for use within 5-10 minutes</p>
            <p>• Contact support if you need assistance</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBackToHome}
          className="btn-primary w-full"
        >
          Back to Home
        </button>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@topboy.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              support@topboy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success; 