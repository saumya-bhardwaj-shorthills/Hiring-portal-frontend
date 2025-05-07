import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiUser } from 'react-icons/fi';
import { useMsal } from '@azure/msal-react';

export default function Header() {
  const { instance, accounts } = useMsal();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const onLogout = () => instance.logoutPopup();

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-4 fixed w-full z-10" style={{ left: '16rem' }}>
      {/* placeholder for a hamburger if you want */}
      <div />

      {/* user menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <FiUser size={20} />
          <span>{accounts[0].username}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
            <button
              onClick={onLogout}
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
