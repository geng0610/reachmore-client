// src/components/Sidebar.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, OrganizationSwitcher, useOrganization, useUser } from "@clerk/clerk-react";

const Sidebar: React.FC = () => {
  const { user } = useUser();
  const { membership } = useOrganization();
  const role = (membership?.role?.match(/org:(.+)/) || [])[1] || "";
  return (
    <>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <svg className="bi pe-none me-2" width="40" height="32">
          {/* Your SVG or Logo */}
        </svg>
        <span className="fs-4">Sidebar</span>
      </Link>
      <hr />
     <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link text-white')} aria-current="page">
            <i className="bi bi-file-earmark-text-fill pe-3"></i>
            RFPs
          </NavLink>
        </li>
        <li>
          <NavLink to="/vendors" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link text-white')}>
            <i className="bi bi-building-fill pe-3"></i>
            Vendors
          </NavLink>
        </li>
        <hr/>
        <li>
          <NavLink to="/vendor-profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link text-white')}>
            <i className="bi bi-person-fill pe-3"></i>
            Vendor Profile
          </NavLink>
        </li>
        <hr/>
        <li>
          <NavLink to="/requirements" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link text-white')}>
            <i className="bi bi-list-check pe-3" ></i>
            Requirements
          </NavLink>
        </li>
        <li>
          <NavLink to="/approval-states" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link text-white')}>
            <i className="bi bi-person-fill pe-3"></i>
            Approval States
          </NavLink>
        </li>

      </ul>
      <hr />
      <div className="d-flex flex-column">
        <div className="row pb-4">
          <div className="col">
            <OrganizationSwitcher 
              hidePersonal 
              appearance={{
              elements: {
                avatarBox: {
                  width: "28px",
                  height: "28px",
                },
                avatarImage: {
                  width: "28px",
                  height: "28px",
                },
                organizationName: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: "1rem", // This adds the padding similar to Bootstrap's ps-3
                },
              },
            }}/>
          </div>
        </div>
        <div className="row pb-2">
          <div className="col">
            <div className="flex-container d-flex ps-2">
                <UserButton />
                <div className="truncate ps-3">{user?.firstName || user?.username || "User"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
