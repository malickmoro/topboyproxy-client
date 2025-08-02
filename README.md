# TopBoy Proxy Client

A modern, mobile-friendly client website for purchasing proxy services. Built with React, TypeScript, and TailwindCSS.

## Features

- **Category Selection**: Browse and select from available proxy categories
- **Real-time Pricing**: See unit prices and available quantities
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Payment Integration**: Seamless Hubtel payment processing
- **Form Validation**: Client-side validation for phone numbers and quantities
- **Error Handling**: Graceful error states with retry functionality
- **Success/Cancel Pages**: Clear feedback for payment outcomes

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/              # Page components
│   ├── CategorySelection.tsx
│   ├── Invoice.tsx
│   ├── Success.tsx
│   └── Cancel.tsx
├── services/           # API and external services
│   └── api.ts
├── App.tsx            # Main app component with routing
├── index.tsx          # React entry point
└── index.css          # Global styles and Tailwind imports
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TopBoy-Client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_KEY=pFYuSfBn1Iw2XBlN-CAokQn
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## API Integration

The application expects the following API endpoints:

### GET /api/client/proxy-categories
Returns available proxy categories with pricing information.

**Response:**
```json
[
  {
    "id": "category-1",
    "name": "FIFTY proxies",
    "availableCount": 100,
    "unitPrice": 50.00,
    "description": "High-speed residential proxies"
  }
]
```

### POST /api/client/generate-invoice
Generates an invoice and returns a payment link.

**Request:**
```json
{
  "category": "category-1",
  "quantity": 5,
  "phoneNumber": "0241234567"
}
```

**Response:**
```json
{
  "paymentUrl": "https://hubtel.com/pay/...",
  "invoiceId": "inv-123456",
  "amount": 250.00
}
```

## Features in Detail

### Category Selection Page (`/`)
- Fetches and displays available proxy categories
- Shows name, available count, and unit price
- Allows quantity selection with validation
- Real-time total cost calculation
- Mobile-optimized card layout

### Invoice Page (`/invoice`)
- Displays order summary with cost breakdown
- Phone number input with Ghana number validation
- Integration with Hubtel payment gateway
- Loading states and error handling

### Success Page (`/success`)
- Confirmation of successful payment
- Clear next steps for users
- Support contact information

### Cancel Page (`/cancel`)
- Handles payment failures and cancellations
- Common issues explanation
- Retry functionality

## Styling

The application uses TailwindCSS with custom components:

- **Custom Colors**: Primary, success, and error color schemes
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animations**: Smooth transitions and loading states
- **Custom Components**: Reusable button and form styles

## Form Validation

- **Phone Numbers**: Ghana phone number format validation
- **Quantities**: Minimum 1, maximum based on available count
- **Required Fields**: Category selection and phone number
- **Real-time Validation**: Immediate feedback on input errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@topboy.com # topboyproxy-client
