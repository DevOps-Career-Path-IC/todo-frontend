import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';
export {};

const Navigation: React.FC = () => {
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-logo">Todo App</div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
              Reports
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
