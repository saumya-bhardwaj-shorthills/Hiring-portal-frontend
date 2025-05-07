import React from 'react';
import { useMsal } from '@azure/msal-react';

export default function LoginPage() {
  const { instance } = useMsal();
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <button
        onClick={() => instance.loginPopup({
          scopes: ['User.Read','Files.Read','Sites.Read.All']
        })}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Login with Microsoft
      </button>
    </div>
  );
}
