// src/components/TopBar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';

const TopBar: React.FC = () => {
  return (
    <Navbar bg="light" expand="md" className="px-3 py-md-4 d-md-none">
      {/* Brand or Logo, hidden on medium and larger screens */}
      <Navbar.Brand href="#" className="d-md-none">MyApp</Navbar.Brand>

      {/* Navigation Menu for Mobile */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto d-md-none"> {/* d-md-none hides this on medium and larger screens */}
          <NavLink to="/" className="nav-link">Requirement Documents</NavLink>
          <NavLink to="/requirements" className="nav-link">Requirements</NavLink>
          <NavLink to="/vendors" className="nav-link">Vendors</NavLink>
          <NavLink to="/account" className="nav-link">User's Account</NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopBar;
