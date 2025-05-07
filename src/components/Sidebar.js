import React from 'react';
import { FiUsers, FiUploadCloud } from 'react-icons/fi';
import logo from '../assets/logo.png';

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-64 bg-indigo-50 border-r border-gray-200 flex-shrink-0">
      {/* BIG, CLEAR LOGO */}
      <div className="h-32 flex items-center justify-center bg-indigo-100">
        <img src={logo} alt="Company Logo" className="h-20 w-auto" />
      </div>

      {/* NAVIGATION */}
      <nav className="px-4 py-6 space-y-2">
        <button
          onClick={() => onNavigate('candidates')}
          className={`
            flex items-center w-full px-4 py-2 rounded-lg transition
            ${activePage==='candidates'
              ? 'bg-indigo-200 text-indigo-800 font-semibold'
              : 'text-indigo-700 hover:bg-indigo-100'}
          `}
        >
          <FiUsers className="mr-3" /> All Candidates
        </button>
        <button
          onClick={() => onNavigate('fetch')}
          className={`
            flex items-center w-full px-4 py-2 rounded-lg transition
            ${activePage==='fetch'
              ? 'bg-indigo-200 text-indigo-800 font-semibold'
              : 'text-indigo-700 hover:bg-indigo-100'}
          `}
        >
          <FiUploadCloud className="mr-3" /> Fetch Resumes
        </button>
      </nav>
    </aside>
  );
}
