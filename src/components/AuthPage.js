// src/components/AuthPage.js
import React, { useState } from 'react';
import { Card, Button, TextInput, Label } from 'flowbite-react';
import { useMsal } from '@azure/msal-react';

export default function AuthPage({ onLocalLogin, onLocalSignup }) {
  const { instance } = useMsal();
  const [isSignup, setIsSignup] = useState(false);

  // form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleMsLogin = () => {
    instance.loginPopup({
      scopes: ['User.Read', 'Files.Read', 'Sites.Read.All'],
    });
  };

  const submitLogin = (e) => {
    e.preventDefault();
    onLocalLogin({ email: loginEmail, password: loginPassword });
  };

  const submitSignup = (e) => {
    e.preventDefault();
    onLocalSignup({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-indigo-50 px-4">
      <div className="w-full max-w-md">
        <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-6">
          {/* Toggle Buttons */}
          <div className="flex mb-8 space-x-2">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 rounded-lg text-center font-medium transition ${
                !isSignup
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 rounded-lg text-center font-medium transition ${
                isSignup
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {!isSignup ? (
            <form onSubmit={submitLogin} className="space-y-6">
              <div>
                <Label htmlFor="login-email" value="Email" className="text-gray-800" />
                <TextInput
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="login-password" value="Password" className="text-gray-800" />
                <TextInput
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Log In
              </Button>
            </form>
          ) : (
            <form onSubmit={submitSignup} className="space-y-6">
              <div>
                <Label htmlFor="signup-name" value="Full Name" className="text-gray-800" />
                <TextInput
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="signup-email" value="Email" className="text-gray-800" />
                <TextInput
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="signup-password" value="Password" className="text-gray-800" />
                <TextInput
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Account
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-600 font-medium">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Microsoft SSO */}
          <Button
            onClick={handleMsLogin}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white"
          >
            Continue with Microsoft
          </Button>
        </Card>
      </div>
    </div>
  );
}
