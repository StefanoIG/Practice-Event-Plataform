import React from 'react';
import { Link } from 'react-router-dom';  // Si usas React Router

interface NavbarProps {
  links: { name: string; path: string }[];  // Lista de enlaces con nombre y ruta
  className?: string;  // Clases CSS opcionales
}

const Navbar: React.FC<NavbarProps> = ({ links, className = '' }) => {
  return (
    <nav className={`navbar ${className}`}>
      <div className="logo">
        <Link to="/">Eventos</Link>
      </div>
      <ul className="nav-links">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
