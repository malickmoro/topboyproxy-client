import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService, ProxyCategory, HubtelPaymentResponse, ReddePaymentResponse } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCategoryFullName } from '../utils/categoryUtils';

interface LocationState {
  category: ProxyCategory;
  quantity: number;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'GH', name: 'Ghana', dialCode: '233', flag: '🇬🇭' },
  { code: 'NG', name: 'Nigeria', dialCode: '234', flag: '🇳🇬' },
];

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to Ghana
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'hubtel' | 'redde'>('hubtel'); // Default to Hubtel
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);
  
  // Get data from navigation state
  const state = location.state as LocationState;
  
  // If no state, redirect back to category selection
  if (!state?.category || !state?.quantity) {
    navigate('/', { replace: true });
    return null;
  }

  const { category, quantity } = state;

  const totalAmount = category.unitPrice * quantity;

  const validatePhoneNumber = (phone: string, country: Country): boolean => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (country.code === 'GH') {
      // Ghana phone number validation
      // Valid formats: 0241234567, 233241234567, 02412345678 (10 digits)
      const ghanaRegex = /^(233|0)?[0-9]{9}$/;
      if (!ghanaRegex.test(cleanPhone)) {
        setPhoneError('Please enter a valid Ghana phone number (e.g., 0241234567)');
        return false;
      }
    } else if (country.code === 'NG') {
      // Nigeria phone number validation
      // Valid formats: 08012345678, 2348012345678, 8012345678 (11 digits)
      const nigeriaRegex = /^(234|0)?[0-9]{10}$/;
      if (!nigeriaRegex.test(cleanPhone)) {
        setPhoneError('Please enter a valid Nigeria phone number (e.g., 08012345678)');
        return false;
      }
    }
    
    setPhoneError(null);
    return true;
  };

  const formatPhoneForAPI = (phone: string, country: Country): string => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (country.code === 'GH') {
      // For Ghana: if starts with 0, replace with 233, if starts with 233, keep as is
      if (cleanPhone.startsWith('0')) {
        return '233' + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith('233')) {
        return cleanPhone;
      }
      return '233' + cleanPhone;
    } else if (country.code === 'NG') {
      // For Nigeria: if starts with 0, replace with 234, if starts with 234, keep as is
      if (cleanPhone.startsWith('0')) {
        return '234' + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith('234')) {
        return cleanPhone;
      }
      return '234' + cleanPhone;
    }
    
    return cleanPhone;
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      // Clear phone number when country changes
      setPhoneNumber('');
      setPhoneError(null);
      setIsCountryDropdownOpen(false);
    }
  };

  const toggleCountryDropdown = () => {
    if (!loading) {
      setIsCountryDropdownOpen(!isCountryDropdownOpen);
    }
  };

  const getPhoneDisplayValue = (): string => {
    if (!phoneNumber) return '';
    
    // Always return the local number without country code for display
    return phoneNumber;
  };

  const handlePhoneInputChange = (value: string) => {
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    
    // Store the local number (without country code)
    setPhoneNumber(cleanValue);
    
    // For validation, we need to check the full number with country code
    // If the number starts with 0, remove it before adding country code
    const numberForValidation = cleanValue.startsWith('0') 
      ? selectedCountry.dialCode + cleanValue.substring(1)
      : selectedCountry.dialCode + cleanValue;
      
    if (cleanValue) {
      validatePhoneNumber(numberForValidation, selectedCountry);
    } else {
      setPhoneError(null);
    }
  };

  const handleMakePayment = async () => {
    // Create the full number for validation and API call
    const fullPhoneNumber = phoneNumber.startsWith('0') 
      ? selectedCountry.dialCode + phoneNumber.substring(1)
      : selectedCountry.dialCode + phoneNumber;
      
    if (!validatePhoneNumber(fullPhoneNumber, selectedCountry)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formattedPhone = formatPhoneForAPI(fullPhoneNumber, selectedCountry);

      const response = await apiService.generateInvoice({
        category: category.category,
        quantity: quantity,
        phoneNumber: formattedPhone,
      }, selectedPaymentMethod);

      // Handle different response structures based on payment method
      let checkoutUrl: string;
      if (selectedPaymentMethod === 'hubtel') {
        checkoutUrl = (response as HubtelPaymentResponse).data.checkoutUrl;
      } else {
        checkoutUrl = (response as ReddePaymentResponse).checkouturl;
      }

      // Redirect to payment page
      window.location.href = checkoutUrl;
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
              className="mx-auto h-16 w-auto object-contain dark:hidden"
            />
            <img 
              src="/pia.png" 
              alt="PIA - Private Internet Access" 
              className="mx-auto h-16 w-auto object-contain hidden dark:block"
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
          <div className="flex gap-2">
            <div className="relative flex-shrink-0" style={{ width: '120px' }} ref={countryDropdownRef}>
              <button
                type="button"
                onClick={toggleCountryDropdown}
                disabled={loading}
                className="w-full px-4 py-3 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex items-center justify-between h-14"
              >
                <span>{selectedCountry.flag} {selectedCountry.dialCode}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryChange(country.code)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                    >
                      <span>{country.flag} {country.dialCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              id="phone"
              value={getPhoneDisplayValue()}
              onChange={(e) => handlePhoneInputChange(e.target.value)}
              className="flex-1 input-field"
              placeholder={selectedCountry.code === 'GH' ? '0241234567' : '08012345678'}
              disabled={loading}
            />
          </div>
          {phoneError && (
            <p className="text-sm text-error-600 mt-2">{phoneError}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            We'll send notifications to this number
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedCountry.code === 'GH' 
              ? 'Enter your number without the country code (e.g., 0241234567)' 
              : 'Enter your number without the country code (e.g., 08012345678)'
            }
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="card mb-6">
          <label className="form-label">
            Payment Method
          </label>
          <div className="space-y-3">
            <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
              selectedPaymentMethod === 'hubtel' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="hubtel"
                checked={selectedPaymentMethod === 'hubtel'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value as 'hubtel' | 'redde')}
                className="mr-3 text-primary-600 focus:ring-primary-500"
                disabled={loading}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">H</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Hubtel</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mobile money & card payments</div>
                  </div>
                </div>
              </div>
            </label>
            
            <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
              selectedPaymentMethod === 'redde' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="redde"
                checked={selectedPaymentMethod === 'redde'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value as 'hubtel' | 'redde')}
                className="mr-3 text-primary-600 focus:ring-primary-500"
                disabled={loading}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">R</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Redde</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mobile money & bank transfers</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
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
              `Pay with ${selectedPaymentMethod === 'hubtel' ? 'Hubtel' : 'Redde'}`
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
                You'll be redirected to {selectedPaymentMethod === 'hubtel' ? 'Hubtel' : 'Redde'} for secure payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice; 