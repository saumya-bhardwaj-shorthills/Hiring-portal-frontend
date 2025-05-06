import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';

export default function Sidebar({ isOpen, onToggle, activePage, onNavigate }) {
  return (
    <aside
      className={`
        flex flex-col bg-white border-r
        transition-all duration-200
        ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}
      `}
    >
      {/* Only render contents when open */}
      {isOpen && (
        <>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={onToggle} className="p-2">
              <FiChevronLeft size={20} />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            <button
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100
                ${activePage === 'fetch' ? 'bg-gray-100 font-medium' : ''}`}
              onClick={() => { onNavigate('fetch'); }}
            >
              Fetch Resumes
            </button>
            <button
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100
                ${activePage === 'candidates' ? 'bg-gray-100 font-medium' : ''}`}
              onClick={() => { onNavigate('candidates'); }}
            >
              Candidates
            </button>
          </nav>
        </>
      )}
    </aside>
  );
}
