// src/pages/SignUpPage.tsx
import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <SignUp/>
    </div>
  );
};

export default SignUpPage;
