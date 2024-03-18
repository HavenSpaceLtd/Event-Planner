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
        <Navbar.Brand href="/" className="ml-lg-0" style={{ color: 'black',fontFamily: 'Aloja',fontSize: '40px' }} >Event Planner</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/home" style={{ marginRight: '30px', color: 'black' }}>Home</Nav.Link>
            <Nav.Link href="collaboration" style={{ marginRight: '30px', color: 'black' }}>Collaboration</Nav.Link>
            <Nav.Link href="resources" style={{ color: 'black' }}>Resources</Nav.Link>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;