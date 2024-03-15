import React, { useState, useEffect } from 'react';
import './Navbar1.css';
import { BsFileEarmarkRichtext, BsCashStack, BsChat, BsPeopleFill, BsSearch } from 'react-icons/bs'; // Import icons

function NavBar2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (isOpen) => {
    setMenuOpen(isOpen);
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
      const storedUserName = sessionStorage.getItem('userName');
      setUserName(storedUserName || "");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/login', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        // Clear user data from local storage
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userName');
        setIsLoggedIn(false);
        // Additional logout logic may be added here
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'bisque', color: 'black' }}>
      <div className="container-fluid">
        <a className="navbar-brand ml-lg-0" href="/" style={{ color: 'black' }}>Event Planner</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className="nav-link"
                href="events"
                style={{ marginRight: '30px', color: 'black' }}
                onMouseEnter={() => toggleMenu(false)}
              >
                Events
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="tasks" style={{ marginRight: '30px', color: 'black' }}>Tasks</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="collaboration" style={{ marginRight: '30px', color: 'black' }}>Collaboration</a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="resources"
                style={{ color: 'black' }}
                onMouseEnter={() => toggleMenu(true)}
                onMouseLeave={() => toggleMenu(false)}
              >
                Resources
              </a>
            </li>
          </ul>
          <div className="d-flex">
            {!isLoggedIn ? (
              <a className="btn btn-outline-primary me-2" href="/login">Get Started</a>
            ) : (
              <>
                <p className="nav-link me-2" style={{ color: 'black' }}>
                  {userName}
                </p>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="menu">
          <div className="card resource-card">
            <div className="card-body">
              <h5 className="card-title">Resources</h5>
              <ul>
                <li><BsFileEarmarkRichtext className="icon" /> Resources</li>
                <li><BsCashStack className="icon" /> Budget</li>
                <li><BsChat className="icon" /> Expense</li>
                <li><BsPeopleFill className="icon" /> Communication</li>
                <li><BsPeopleFill className="icon" /> User</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar2;

