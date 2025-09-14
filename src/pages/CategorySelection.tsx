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
      {/* WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/233508066245?text=Hi! I need help with PIA proxy top-up codes"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Chat with us on WhatsApp"
        >
          <svg 
            className="w-8 h-8" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-1.013-2.03-1.078-.273-.066-.471-.099-.67.099-.197.197-.768.769-.941.927-.173.158-.347.198-.644.05-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Need help? Chat with us!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

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
    </div>
  );
};

export default CategorySelection; 