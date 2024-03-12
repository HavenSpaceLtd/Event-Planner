import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

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
    <Navbar collapseOnSelect expand="lg" variant="dark" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'bisque', color: 'black' }}>
      <Container fluid>
        <Navbar.Brand href="/" className="ml-lg-0" style={{ color: 'black' }}>Event Planner</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#events" style={{ marginRight: '30px', color: 'black' }}>Events</Nav.Link>
            <Nav.Link href="tasks" style={{ marginRight: '30px', color: 'black' }}>Tasks</Nav.Link>
            <Nav.Link href="collaboration" style={{ marginRight: '30px', color: 'black' }}>Collaboration</Nav.Link>
            <Nav.Link href="resources" style={{ color: 'black' }}>Resources</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            {!isLoggedIn ? (
              <Button variant="outline-primary" href="/login">Get Started</Button>
            ) : (
              <>
                <Nav.Link style={{ color: 'black' }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                  {userName}
                </Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout} style={{ color: 'black' }}>Logout</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;