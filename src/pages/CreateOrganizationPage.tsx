// src/pages/CreateOrganizationPage.tsx
import React from 'react';
import { OrganizationSwitcher, CreateOrganization } from '@clerk/clerk-react';

interface CreateOrganizationPageProps {
  user: any;
}

const CreateOrganizationPage: React.FC<CreateOrganizationPageProps> = ({ user }) => {
  // const { clerk } = useClerk();

  return (
    <div className="container mt-5">
      <h2>Welcome, {user?.firstName || 'User'}!</h2>
      <p>To use the application, you need to create or join an organization.</p>

      <div className="mt-4">
        {/* Allow users to create a new organization */}
        <CreateOrganization />
        
        {/* If the user has no organizations, show the switcher to join or create */}
        <OrganizationSwitcher />
      </div>
    </div>
  );
};

export default CreateOrganizationPage;
