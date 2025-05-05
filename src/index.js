// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';            // React 18 API
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import App from './App';
import { msalConfig } from './msalConfig';

const msalInstance = new PublicClientApplication(msalConfig);

// Wait for MSAL to initialize before mounting the React tree
msalInstance.initialize().then(() => {
  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
}).catch(err => {
  console.error("MSAL initialization failed:", err);
});
