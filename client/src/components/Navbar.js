import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 

function NavBar() {
  // Fake user name
  const userName = "John Doe";

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Container fluid>
        <Navbar.Brand href="#home" className="ml-lg-0">Event Planner</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#events" style={{marginRight: '30px'}}>Events</Nav.Link>
            <Nav.Link href="#tasks" style={{marginRight: '30px'}}>Tasks</Nav.Link>
            <Nav.Link href="#collaboration" style={{marginRight: '30px'}}>Collaboration</Nav.Link>
            <Nav.Link href="#resources">Resources</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Button variant="outline-light" href="#login">Login</Button>
            <Nav.Link disabled>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
              {userName}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;