import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
// 1. Import PayPal Provider
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// 2. PayPal configuration 
const paypalOptions = {
  "client-id": "ARF9YiHmZqX1rLzPSsix5nwDlR1VshIMiPNhqwPgl7QmCTTdNJr9hLmvymZxD3uBd911DlBRsI36LdQl",
  currency: "USD", 
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider> 
          {/* 3. Wrap the app with PayPal Provider */}
          <PayPalScriptProvider options={paypalOptions}>
            <App />
          </PayPalScriptProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
