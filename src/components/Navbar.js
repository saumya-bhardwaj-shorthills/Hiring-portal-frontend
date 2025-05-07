import React, { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';

export default function Navbar({ username, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="flex items-center justify-end bg-white border-b border-gray-200 px-6 py-3">
      <div ref={ref} className="relative">
        <FiUser
          size={28}
          className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
          onClick={() => setOpen(o => !o)}
        />
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
            <div className="px-4 py-2 text-sm text-gray-600">
              Signed in as<br/>
              <span className="font-medium text-indigo-800">{username}</span>
            </div>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
