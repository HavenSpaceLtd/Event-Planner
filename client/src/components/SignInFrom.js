import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import googleIcon from '../assets/google.svg';
import emailIcon from '../assets/gmail.svg';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      console.log(data); // You can handle the response data as per your requirements

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="full-page-container" style={{ background: 'linear-gradient(135deg, #ff8080, #b3ff66)', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', marginTop: 0, paddingTop: '50px', paddingBottom: '50px' }}>
      <Container className="mt-5">
        <Row className="justify-content-center" >
          <Col md={6}>
            <Card >
              <Card.Body style={{ background: 'linear-gradient( rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)', borderRadius: '20px' }}>
                <h2 className="text-center text-dark  mb-4" style={{ marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>Log In</h2>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <Form.Label style={{ marginRight: '600px', fontWeight: 'bold'}}>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <Form.Label style={{ marginRight: '600px', fontWeight: 'bold'}}>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="w-100 rounded-pill align-items-center">Log In</Button>
                </Form>
                <div className="text-center mb-4 position-relative" style={{ marginTop: '70px' }}>
                  <hr className="w-100 my-0" style={{ borderColor: '#000' }} />
                  <span className="position-absolute top-50 translate-middle px-3" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '4rem' }}>or</span>
                  <hr className="w-100 my-0" style={{ borderColor: '#000' }} />
                </div>
                <Button variant="light" className="w-100 rounded-pill d-flex align-items-center justify-content-center">
                  <img src={googleIcon} alt="Google Icon" style={{ width: '24px', height: '24px', marginRight: '20px' }} />
                  <span>Log In with Google</span>
                </Button>
                <hr className="my-4" />
                <Button variant="light" className="w-100 rounded-pill d-flex align-items-center justify-content-center">
                  <img src={emailIcon} alt="Email Icon" style={{ width: '24px', height: '24px', marginRight: '20px' }} />
                  <span>Continue with Email</span>
                </Button>
                <div className="text-sm d-flex justify-content-between mt-3">
                  <p>If you dont have an account...</p>
                  <Button variant="outline-primary">Sign Up</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignInForm;