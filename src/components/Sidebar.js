// src/components/Sidebar.js
import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';

export default function Sidebar({
  isOpen,
  onToggleSidebar,
  activePage,
  onNavigate
}) {
  return (
    <>
      {/* Dimmed backdrop */}
      <div
        onClick={onToggleSidebar}
        className={`
          fixed inset-0 bg-black bg-opacity-25
          transition-opacity duration-200
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-white border-r
          transform transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onToggleSidebar} className="p-2">
            <FiChevronLeft size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100
              ${activePage === 'fetch' ? 'bg-gray-100 font-medium' : ''}`}
            onClick={() => {
              onNavigate('fetch');
              onToggleSidebar();
            }}
          >
            Fetch Resumes
          </button>

          <button
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100
              ${activePage === 'candidates' ? 'bg-gray-100 font-medium' : ''}`}
            onClick={() => {
              onNavigate('candidates');
              onToggleSidebar();
            }}
          >
            Candidates
          </button>
        </nav>
      </aside>
    </>
  );
}
