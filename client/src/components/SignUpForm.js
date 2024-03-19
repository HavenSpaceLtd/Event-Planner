import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import googleIcon from '../assets/google.svg';
import emailIcon from '../assets/gmail.svg';
import * as Yup from 'yup';
import { Formik } from 'formik';

const googleIconStyle = {
  width: '24px',
  height: '24px',
};

const iconStyle = {
  width: '24px',
  height: '24px',
};

const SignUpForm = () => {
  const initialValues = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    location: '',
    title: '',
    password: '',
    about: '',
    image: '', // Assuming this will be handled separately, like file upload
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    location: Yup.string().required('Location is required'),
    title: Yup.string().required('Title is required'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters'),
    about: Yup.string().required('About is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
     
      const formDataToSend = new FormData();
      for (let key in values) {
        formDataToSend.append(key, values[key]);
      }
      const response = await fetch('/users', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
  
      console.log('User registered successfully');
  
     
      resetForm();
  
     
      setSubmitting(false);
  
     
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error:', error.message);
    
     
      setSubmitting(false);
    }
  };
  return (
    <div className="full-page-container" style={{ background: 'linear-gradient(135deg, #ff8080, #b3ff66)', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', marginTop: 0, paddingTop: '50px', paddingBottom: '50px' }}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body style={{ background: 'linear-gradient( rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)', borderRadius: '20px' }}>
                <h2 className="text-center text-dark mb-4" style={{ marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>Sign Up</h2>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>First </Form.Label>
                          <Form.Control type="text" placeholder="Enter first name" name="first_name" value={values.first_name} onChange={handleChange} onBlur={handleBlur} />
                          {touched.first_name && errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>Last </Form.Label>
                          <Form.Control type="text" placeholder="Enter last name" name="last_name" value={values.last_name} onChange={handleChange} onBlur={handleBlur} />
                          {touched.last_name && errors.last_name && <div className="text-danger">{errors.last_name}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>Phone</Form.Label>
                          <Form.Control type="text" placeholder="Enter phone" name="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur} />
                          {touched.phone && errors.phone && <div className="text-danger">{errors.phone}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>Email</Form.Label>
                          <Form.Control type="email" placeholder="Enter email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
                          {touched.email && errors.email && <div className="text-danger">{errors.email}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>Location</Form.Label>
                          <Form.Control type="text" placeholder="Enter location" name="location" value={values.location} onChange={handleChange} onBlur={handleBlur} />
                          {touched.location && errors.location && <div className="text-danger">{errors.location}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>Title</Form.Label>
                          <Form.Select name="title" value={values.title} onChange={handleChange} onBlur={handleBlur}>
                            <option value="">Select title</option>
                            <option value="user">User</option>
                            <option value="planner">Planner</option>
                          </Form.Select>
                          {touched.title && errors.title && <div className="text-danger">{errors.title}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>Password</Form.Label>
                          <Form.Control type="password" placeholder="Enter password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                          {touched.password && errors.password && <div className="text-danger">{errors.password}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>About</Form.Label>
                          <Form.Control as="textarea" rows={3} placeholder="Tell us about yourself" name="about" value={values.about} onChange={handleChange} onBlur={handleBlur} />
                          {touched.about && errors.about && <div className="text-danger">{errors.about}</div>}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12}>
                          <Form.Label style={{ marginRight: '600px', fontWeight: 'bold' }}>Image</Form.Label>
                          <Form.Control type="file" name="image" onChange={(e) => setFieldValue('image', e.target.files[0])} onBlur={handleBlur} />
                        </Col>
                      </Row>
                      <Button variant="primary" type="submit" className="w-100 rounded-pill align-items-center" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                      </Button>
                    </Form>
                  )}
                </Formik>
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