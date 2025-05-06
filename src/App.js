import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FetchPanel from './components/FetchPanel';
import CandidateTable from './components/CandidateTable';
import * as api from './api/sharepoint';

export default function App() {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('fetch');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // Acquire token on login
  useEffect(() => {
    if (accounts.length > 0) {
      const acct = accounts[0];
      instance.setActiveAccount(acct);
      api.getAccessToken(instance, acct).then(setToken);
    }
  }, [accounts, instance]);

  const handleLogin = () => {
    instance
      .loginPopup({ scopes: ['User.Read','Files.Read','Sites.Read.All'] })
      .then(resp => {
        instance.setActiveAccount(resp.account);
        return api.getAccessToken(instance, resp.account);
      })
      .then(setToken)
      .catch(console.error);
  };

  const handleLogout = () => {
    instance.logoutPopup();
    setToken(null);
  };

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) return;
    const results = await api.searchCandidatesApi(token, keyword);
    setSearchResults(results);
    setActivePage('candidates');
  };

  if (accounts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login with Microsoft
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar is now a flex item */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        activePage={activePage}
        onNavigate={page => {
          setActivePage(page);
          if (page === 'candidates') setSearchResults(null);
        }}
      />

      {/* Main content flexes and shifts automatically */}
      <div className="flex-1 flex flex-col transition-all duration-200">
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          onLogout={handleLogout}
          username={accounts[0].username}
        />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {activePage === 'fetch' && token && <FetchPanel token={token} />}
          {activePage === 'candidates' && token && (
            <CandidateTable token={token} searchResults={searchResults} />
          )}
        </main>
      </div>
    </div>
  );
}
