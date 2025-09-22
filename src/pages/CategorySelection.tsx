import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, ProxyCategory } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getCategoryFullName } from '../utils/categoryUtils';

const CategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ProxyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProxyCategory | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProxyCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load proxy categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateQuantity = (value: number): boolean => {
    if (!selectedCategory) return false;
    
    if (value < 1) {
      setQuantityError('Quantity must be at least 1');
      return false;
    }
    
    if (value > selectedCategory.availableCount) {
      setQuantityError(`Only ${selectedCategory.availableCount} proxies available`);
      return false;
    }
    
    setQuantityError(null);
    return true;
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    if (selectedCategory) {
      validateQuantity(value);
    }
  };

  const handleCategorySelect = (category: ProxyCategory) => {
    setSelectedCategory(category);
    setQuantity(1);
    setQuantityError(null);
  };

  const handleContinue = () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    if (!validateQuantity(quantity)) {
      return;
    }

    // Navigate to invoice page with selected data
    navigate('/invoice', {
      state: {
        category: selectedCategory,
        quantity: quantity,
      },
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ErrorMessage message={error} onRetry={fetchCategories} />
      </div>
    );
  }

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
            Select Proxy Category
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your preferred proxy category and quantity
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.category}
              className={`card cursor-pointer transition-all duration-200 ${
                selectedCategory?.category === category.category
                  ? 'ring-2 ring-primary-500 border-primary-200'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {getCategoryFullName(category.category)}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.availableCount} available
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(category.unitPrice)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">per code</span>
              </div>
              
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {category.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Quantity Selection */}
        {selectedCategory && (
          <div className="card mb-8 animate-slide-up">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={selectedCategory.availableCount}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="input-field"
              placeholder="Enter quantity"
            />
            {quantityError && (
              <p className="text-sm text-error-600 mt-2">{quantityError}</p>
            )}
            
            {/* Total Preview */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Total Cost:</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(selectedCategory.unitPrice * quantity)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedCategory || !!quantityError}
          className="btn-primary w-full"
        >
          Continue to Payment
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <img 
                src="/pia.jpg" 
                alt="PIA - Private Internet Access" 
                className="h-6 w-auto object-contain dark:hidden mr-2"
              />
              <img 
                src="/pia.png" 
                alt="PIA - Private Internet Access" 
                className="h-6 w-auto object-contain hidden dark:block mr-2"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                TopBoy Proxy
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
              Need help? Contact us anytime
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
              {/* Phone */}
              <a
                href="tel:+233599036479"
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-xs font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +233 59 903 6479
              </a>
              
              {/* Email */}
              <a
                href="mailto:support@topboyproxy.com"
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-xs font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
            
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
              © 2024 TopBoy Proxy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategorySelection; 