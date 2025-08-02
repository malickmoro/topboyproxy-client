import axios from 'axios';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

if (!API_BASE_URL || !API_KEY) {
  throw new Error("Missing environment variables REACT_APP_API_URL or REACT_APP_API_KEY");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY,
  },
});

// Types based on the actual API specification
export interface ProxyCategory {
  category: 'FIFTY' | 'HUNDRED';
  availableCount: number;
  unitPrice: number;
  description?: string;
}

export interface InvoiceRequest {
  category: 'FIFTY' | 'HUNDRED';
  quantity: number;
  phoneNumber: string;
}

export interface PaymentLinkResponse {
  responseCode: string;
  status: string;
  data: {
    checkoutUrl: string;
    checkoutId: string;
    clientReference: string;
    message: string;
    checkoutDirectUrl: string;
  };
}

// Always use real API - no mock data
const useMockApi = false;

// API functions
export const apiService = {
  // Get available proxy categories
  getProxyCategories: async (): Promise<ProxyCategory[]> => {
    try {
      const response = await api.get('/api/client/proxy-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching proxy categories:', error);
      throw new Error('Failed to fetch proxy categories');
    }
  },

  // Generate invoice and get payment link
  generateInvoice: async (data: InvoiceRequest): Promise<PaymentLinkResponse> => {
    try {
      const response = await api.post('/api/client/generate-invoice', data);
      return response.data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw new Error('Failed to generate invoice');
    }
  },
};

export default api; 