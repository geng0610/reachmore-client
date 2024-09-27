// src/pages/SignInPage.tsx
import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div className="container mt-5">
      <h2>Sign In</h2>
      <SignIn/>
    </div>
  );
};

export default SignInPage;