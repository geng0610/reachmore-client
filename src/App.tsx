// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useOrganizationList, useUser } from '@clerk/clerk-react';
import Layout from './components/Layout';
import CreateOrganizationPage from './pages/CreateOrganizationPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import { useSetupAxiosInterceptors } from './hooks/useSetupAxiosInterceptors';
import posthog from 'posthog-js';


const App: React.FC = () => {
  useSetupAxiosInterceptors();

  const { userMemberships } = useOrganizationList({
    userMemberships: true,
  });
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
      });
    }
  }, [user]);

  return (
    <Router>
      <SignedIn>
          {userMemberships.isLoading ? (
            <div>Loading...</div>
          ) : userMemberships.count > 0 ? (
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            </Routes>
          ) : (
            <CreateOrganizationPage user={user} />
          )}
      </SignedIn>

      <SignedOut>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      </SignedOut>
    </Router>
  );
};

export default App;
