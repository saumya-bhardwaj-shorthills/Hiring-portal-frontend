import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import LoginControl from './components/LoginControl';
import FetchPanel from './components/FetchPanel';
import SearchPanel from './components/SearchPanel';
import { getAccessToken } from './api/sharepoint';

export default function App() {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState(null);
  const [activePanel, setActivePanel] = useState('fetch');

  // When user logs in, set active account and fetch token
  useEffect(() => {
    if (accounts.length > 0) {
      const acct = accounts[0];
      instance.setActiveAccount(acct);
      getAccessToken(instance, acct).then(setToken);
    }
  }, [accounts, instance]);

  const handleLogin = () => {
    instance
      .loginPopup({
        scopes: ['User.Read', 'Files.Read', 'Sites.Read.All']
      })
      .then(resp => {
        instance.setActiveAccount(resp.account);
        return getAccessToken(instance, resp.account);
      })
      .then(setToken)
      .catch(console.error);
  };

  const handleLogout = () => {
    instance.logoutPopup();
    setToken(null);
  };

  // Show login if not signed in
  if (!accounts.length) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>ATS Portal</h2>
        <LoginControl onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: 24 }}>
        <h2>ATS Portal</h2>
        <LoginControl onLogout={handleLogout} />
      </header>

      <nav style={{ marginBottom: 24 }}>
        <button
          onClick={() => setActivePanel('fetch')}
          style={{
            marginRight: 8,
            fontWeight: activePanel === 'fetch' ? 'bold' : 'normal'
          }}
        >
          Fetch Resumes
        </button>
        <button
          onClick={() => setActivePanel('search')}
          style={{
            fontWeight: activePanel === 'search' ? 'bold' : 'normal'
          }}
        >
          Search Candidates
        </button>
      </nav>

      <section>
        {activePanel === 'fetch' && token && (
          <FetchPanel token={token} />
        )}
        {activePanel === 'search' && token && (
          <SearchPanel token={token} />
        )}
      </section>
    </div>
  );
}
