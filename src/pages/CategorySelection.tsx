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
              src="/pia.png" 
              alt="PIA - Private Internet Access" 
              className="mx-auto h-16 w-auto object-contain"
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
    </div>
  );
};

export default CategorySelection; 