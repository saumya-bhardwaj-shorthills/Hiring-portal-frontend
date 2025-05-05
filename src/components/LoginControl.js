import React from 'react';
import { useMsal } from '@azure/msal-react';

export default function LoginControl({ onLogin, onLogout }) {
  const { accounts } = useMsal();
  const loggedIn = accounts.length > 0;

  return loggedIn ? (
    <button onClick={onLogout}>Logout</button>
  ) : (
    <button onClick={onLogin}>Login with Microsoft</button>
  );
}
