import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import App from './App';
import { msalConfig } from './msalConfig';
import './index.css';

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </BrowserRouter>
  );
});
