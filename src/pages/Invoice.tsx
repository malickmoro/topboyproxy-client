import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService, ProxyCategory } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCategoryFullName } from '../utils/categoryUtils';

interface LocationState {
  category: ProxyCategory;
  quantity: number;
}

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  // Get data from navigation state
  const state = location.state as LocationState;
  
  // If no state, redirect back to category selection
  if (!state?.category || !state?.quantity) {
    navigate('/', { replace: true });
    return null;
  }

  const { category, quantity } = state;

  const totalAmount = category.unitPrice * quantity;

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic Ghana phone number validation
    const phoneRegex = /^(\+233|0)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid Ghana phone number');
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value) {
      validatePhoneNumber(value);
    } else {
      setPhoneError(null);
    }
  };

  const handleMakePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.generateInvoice({
        category: category.category,
        quantity: quantity,
        phoneNumber: phoneNumber,
      });

      // Redirect to Hubtel payment page
      window.location.href = response.data.checkoutUrl;
    } catch (err) {
      setError('Failed to generate payment link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  const handleBack = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* PIA Logo */}
          <div className="mb-6">
            <img 
              src="/pia.jpg" 
              alt="PIA - Private Internet Access" 
              className="mx-auto h-16 w-auto object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payment Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your order and complete payment
          </p>
        </div>

        {/* Order Summary */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Order Summary
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Category:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{getCategoryFullName(category.category)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{quantity} proxies</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Unit Price:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatPrice(category.unitPrice)}
              </span>
            </div>
            
            <hr className="my-3 border-gray-200 dark:border-gray-700" />
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total:</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="card mb-6">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="input-field"
            placeholder="Enter your phone number (e.g., 0241234567)"
            disabled={loading}
          />
          {phoneError && (
            <p className="text-sm text-error-600 mt-2">{phoneError}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            We'll send payment confirmation to this number
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-error-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleMakePayment}
            disabled={loading || !phoneNumber || !!phoneError}
            className="btn-primary w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              'Make Payment'
            )}
          </button>
          
          <button
            onClick={handleBack}
            disabled={loading}
            className="btn-secondary w-full"
          >
            Back to Categories
          </button>
        </div>

        {/* Payment Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Secure Payment
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                You'll be redirected to Hubtel for secure payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice; 