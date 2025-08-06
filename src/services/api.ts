import axios from 'axios';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://topboyproxy-backend-d7f79039f73a.herokuapp.com';
const API_KEY = process.env.REACT_APP_API_KEY || 'pFYuSfBn1Iw2XBlN-CAokQn';

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

// Hubtel response structure
export interface HubtelPaymentResponse {
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

// Redde response structure
export interface ReddePaymentResponse {
  status: string;
  reason: string;
  referenceid: string;
  responsetoken: string;
  checkouturl: string;
  checkouttransid: string;
}

// Union type for both payment responses
export type PaymentResponse = HubtelPaymentResponse | ReddePaymentResponse;

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
  generateInvoice: async (data: InvoiceRequest, type: 'hubtel' | 'redde'): Promise<PaymentResponse> => {
    try {
      const response = await api.post(`/api/client/${type}/checkout`, data);
      return response.data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw new Error('Failed to generate invoice');
    }
  },
};

export default api; 