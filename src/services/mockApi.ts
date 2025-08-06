import { ProxyCategory, InvoiceRequest, HubtelPaymentResponse } from './api';

// Mock data for proxy categories
const mockCategories: ProxyCategory[] = [
  {
    category: 'FIFTY',
    availableCount: 150,
    unitPrice: 50,
    description: 'High-speed residential proxies with 50Mbps bandwidth'
  },
  {
    category: 'HUNDRED',
    availableCount: 75,
    unitPrice: 100,
    description: 'Premium residential proxies with 100Mbps bandwidth'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  // Get available proxy categories
  getProxyCategories: async (): Promise<ProxyCategory[]> => {
    // Simulate network delay
    await delay(1000);
    
    // Simulate occasional failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Network error - please try again');
    }
    
    return mockCategories;
  },

  // Generate invoice and get payment link
  generateInvoice: async (data: InvoiceRequest): Promise<HubtelPaymentResponse> => {
    // Simulate network delay
    await delay(1500);
    
    // Simulate occasional failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Payment service temporarily unavailable');
    }
    
    // Find category for validation
    const category = mockCategories.find(cat => cat.category === data.category);
    
    return {
      responseCode: '0000',
      status: 'Success',
      data: {
        checkoutUrl: `https://hubtel.com/pay/mock-payment-${Date.now()}`,
        checkoutId: `checkout-${Math.random().toString(36).substr(2, 9)}`,
        clientReference: `ref-${Math.random().toString(36).substr(2, 9)}`,
        message: 'Payment link generated successfully',
        checkoutDirectUrl: `https://hubtel.com/pay/direct/mock-payment-${Date.now()}`
      }
    };
  },
}; 