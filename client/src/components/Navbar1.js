import React, { useState } from 'react';
import { BsListCheck, BsPeopleFill, BsFileEarmarkRichtext, BsCashStack, BsChat, BsSearch } from "react-icons/bs"; // Import icons
import './Navbar1.css'; // Import CSS file

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="menu-icon" onMouseEnter={toggleMenu} onMouseLeave={toggleMenu}>
        <BsListCheck className="icon" />
        {menuOpen && (
          <div className="menu">
            <a href="#">
              <BsFileEarmarkRichtext className="icon" />
              Resources
            </a>
            <a href="#">
              <BsCashStack className="icon" />
              Budget
            </a>
            <a href="#">
              <BsChat className="icon" />
              Expense
            </a>
            <a href="#">
              <BsPeopleFill className="icon" />
              Communication
            </a>
            <a href="#">
              <BsPeopleFill className="icon" />
              User
            </a>
          </div>
        )}
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <BsSearch className="search-icon" />
      </div>
    </nav>
  );
}

export default Navbar;