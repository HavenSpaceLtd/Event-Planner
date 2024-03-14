import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

// Import SVG icons
import FacebookIcon from '../assets/facebook.svg';
import TwitterIcon from '../assets/twitter.svg';
import LinkedinIcon from '../assets/linkedin.svg';
import DropboxIcon from '../assets/dropbox.svg';
import GithubIcon from '../assets/github.svg';
import GitlabIcon from '../assets/gitlab.svg';
import GoogleIcon from '../assets/google.svg';
import EmailIcon from '../assets/gmail.svg';

function Footer() {
  return (
    <footer style={{ backgroundColor: 'bisque', color: 'black', padding: '50px 0', marginTop: 'auto' }}>
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
          <Col md={4}>
            <h5>Subscribe to Our Newsletter</h5>
            <p>Stay up to date with our latest news and updates by subscribing to our newsletter:</p>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Subscribe
              </Button>
            </Form>
          </Col>
          <Col md={4}>
            <h5>Connect With Us</h5>
            <ul className="list-unstyled d-flex justify-content-between">
              <li>
                <a href="#facebook" className="text-dark">
                  <img src={FacebookIcon} alt="Facebook" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#twitter" className="text-dark">
                  <img src={TwitterIcon} alt="Twitter" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#linkedin" className="text-dark">
                  <img src={LinkedinIcon} alt="LinkedIn" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#dropbox" className="text-dark">
                  <img src={DropboxIcon} alt="Dropbox" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#github" className="text-dark">
                  <img src={GithubIcon} alt="GitHub" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#gitlab" className="text-dark">
                  <img src={GitlabIcon} alt="GitLab" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#google" className="text-dark">
                  <img src={GoogleIcon} alt="Google" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#email" className="text-dark">
                  <img src={EmailIcon} alt="Email" width="24" height="24" />
                </a>
              </li>
            </ul>
            <p className="mt-3">Stay connected with us on social media for updates and news!</p>
          </Col>
        </Row>
        <hr />
        <Row className="text-center">
          <Col>
            <ul className="list-unstyled d-flex justify-content-center">
              <li><a href="#privacy" className="text-muted mx-2">Privacy Policy</a></li>
              <li><a href="#terms" className="text-muted mx-2">Terms of Use</a></li>
              <li><a href="#sitemap" className="text-muted mx-2">Sitemap</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div style={{ backgroundColor: '#6c757d', color: 'white', padding: '20px 0' }}>
        <Container className="text-center">
          <small>&copy; {new Date().getFullYear()} Event Planner. All rights reserved.</small>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;