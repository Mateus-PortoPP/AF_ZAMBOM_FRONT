import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './auth/AuthContext.tsx';

// Obter as variáveis de ambiente
const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';

if (!domain || !clientId) {
  console.error('Auth0 configuration is missing. Please check your .env file.');
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: 'https://dev-3dubttw6qr6far2c.us.auth0.com/api/v2/',
        redirect_uri: window.location.origin
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </Auth0Provider>
  </React.StrictMode>
);
