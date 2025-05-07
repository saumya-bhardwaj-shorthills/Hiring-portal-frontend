// src/App.js
import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import FetchPanel from './components/FetchPanel';
import CandidateTable from './components/CandidateTable';
import * as api from './api/sharepoint';

export default function App() {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState(null);
  const [activePage, setActivePage] = useState('candidates');

  useEffect(() => {
    if (accounts.length) {
      instance.setActiveAccount(accounts[0]);
      api.getAccessToken(instance, accounts[0]).then(setToken);
    }
  }, [accounts, instance]);

  // Local auth stubs (replace with real API calls)
  const handleLocalLogin = ({ email, password }) => {
    console.log('Local login:', email, password);
    // e.g. call backend, then setToken(...) / handle error
  };
  const handleLocalSignup = ({ name, email, password }) => {
    console.log('Local signup:', name, email, password);
    // e.g. call backend then maybe auto-login
  };

  // If no MS account, show AuthPage
  if (!accounts.length) {
    return (
      <AuthPage
        onLocalLogin={handleLocalLogin}
        onLocalSignup={handleLocalSignup}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Navbar
          username={accounts[0].username}
          onLogout={() => instance.logoutPopup()}
        />
        <main className="flex-1 overflow-auto p-6">
          {activePage === 'fetch' && <FetchPanel token={token} />}
          {activePage === 'candidates' && <CandidateTable token={token} />}
        </main>
      </div>
    </div>
  );
}
