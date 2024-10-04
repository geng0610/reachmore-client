// src/main.tsx
// import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './scss/main.scss'; // Import custom SCSS file
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import posthog from 'posthog-js'

posthog.init('phc_fjWoJwVKvtGo9EeNinLI1RPxoUZhfHc2ouYkPCYwtBG',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      // Set the sign-in and sign-up URLs
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      // fallbackRedirectUrl="/" // Updated prop
    >
      <App />
    </ClerkProvider>
  // </React.StrictMode>
);
