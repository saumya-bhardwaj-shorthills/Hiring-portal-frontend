import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiUser } from 'react-icons/fi';

export default function Navbar({
  sidebarOpen,
  onToggleSidebar,
  searchTerm,
  setSearchTerm,
  onSearch,
  onLogout,
  username
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef();

  // close profile menu if clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b">
      {/* Hamburger */}
      <button onClick={onToggleSidebar} className="p-2 mr-4 text-gray-600 hover:text-gray-900">
        <FiMenu size={24} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-lg flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search candidates…"
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={() => onSearch(searchTerm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Profile Icon & Dropdown */}
      <div className="relative ml-4" ref={menuRef}>
        <button
          onClick={() => setProfileOpen(o => !o)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <FiUser size={24} />
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
            <div className="px-4 py-2 text-gray-700 border-b">
              Signed in as<br/>
              <span className="font-semibold">{username}</span>
            </div>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
