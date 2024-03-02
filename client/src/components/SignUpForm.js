import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import googleIcon from '../assets/google.svg';
import emailIcon from '../assets/gmail.svg';


const googleIconStyle = {
  width: '24px',
  height: '24px',
};

const iconStyle = {
  width: '24px',
  height: '24px',
};

const SignUpForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log('Form submitted');
  };

  return (
    <div className="full-page-container" style={{ background: 'linear-gradient(135deg, #ff8080, #b3ff66)', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', marginTop: 0, paddingTop: '50px', paddingBottom: '50px' }}>
      <Container className="mt-5">
        <Row className="justify-content-center" >
          <Col md={6}>
            <Card >
              <Card.Body style={{ background: 'linear-gradient( rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)', borderRadius: '20px' }}>
                <h2 className="text-center text-dark  mb-4" style={{ marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>Sign Up</h2>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <Form.Label style={{ marginRight: '600px', fontWeight: 'bold'}}>Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter name" />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <Form.Label style={{ marginRight: '600px', fontWeight: 'bold'}}>Age</Form.Label>
                      <Form.Control type="number" placeholder="Enter age" />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <Form.Label style={{ marginRight: '600px', fontWeight: 'bold'}}>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <Form.Label style={{ marginRight: '600px', fontWeight: 'bold'}}>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="w-100 rounded-pill align-items-center">Sign Up</Button>
                </Form>
                <div className="text-center mb-4 position-relative" style={{ marginTop: '70px' }}>
                  <hr className="w-100 my-0" style={{ borderColor: '#000' }} />
                  <span className="position-absolute top-50 translate-middle px-3" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '4rem' }}>or</span>
                  <hr className="w-100 my-0" style={{ borderColor: '#000' }} />
                </div>
                <Button variant="light" className="w-100 rounded-pill d-flex align-items-center justify-content-center">
                  <img src={googleIcon} alt="Google Icon" style={{ ...googleIconStyle, marginRight: '20px' }} />
                  <span>Sign Up with Google</span>
                </Button>
                <hr className="my-4" />
                <Button variant="light" className="w-100 rounded-pill d-flex align-items-center justify-content-center">
                  <img src={emailIcon} alt="Email Icon" style={{ ...iconStyle, marginRight: '20px' }} />
                  <span>Continue with Email</span>
                </Button>
                <div className="text-sm d-flex justify-content-between mt-3">
                  <p>If you already have an account...</p>
                  <Button variant="outline-primary">Log In</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUpForm;