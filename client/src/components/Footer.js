import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px 0', marginTop: 'auto' }}>
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                123 Main Street, City, Country
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                example@example.com
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                +123 456 7890
              </li>
            </ul>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-light">Home</a></li>
              <li><a href="#about" className="text-light">About Us</a></li>
              <li><a href="#services" className="text-light">Services</a></li>
              <li><a href="#contact" className="text-light">Contact Us</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <ul className="list-unstyled d-flex justify-content-between">
              <li>
                <a href="#facebook" className="text-light">
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
              </li>
              <li>
                <a href="#twitter" className="text-light">
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
              </li>
              <li>
                <a href="#linkedin" className="text-light">
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div style={{ backgroundColor: '#6c757d', padding: '10px 0' }}>
        <Container className="text-center">
          <small>&copy; {new Date().getFullYear()} Event  Planner. All rights reserved.</small>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;