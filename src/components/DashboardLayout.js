import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
