import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NewEventForm = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [values, setValues] = useState({
    title: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    amount: '',
    progress: '',
    location: '',
    description: '',
    image: '',
    owner_id: sessionStorage.getItem('userId') || '', // Retrieve owner_id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
  
    if (name.includes('date')) {
      const dateObj = new Date(value);
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const year = dateObj.getFullYear();
      formattedValue = `${month}/${day}/${year}`;
    }
  
    setValues((prevValues) => ({
      ...prevValues,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const token = sessionStorage.getItem('accessToken');
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();
      console.log('Response:', data);
      
      setValues({
        title: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        amount: '',
        progress: '',
        location: '',
        description: '',
        image: '',
        owner_id: sessionStorage.getItem('userId') || '',
      });

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Check if userId exists, if not, navigate to login
  if (!sessionStorage.getItem('userId')) {
    navigate('/login'); // Redirect to login page
    return null; // Return null to prevent rendering
  }

  return (
    <div className="full-page-container" style={{ background: 'linear-gradient(135deg, #ff8080, #b3ff66)', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', marginTop: 0, paddingTop: '50px', paddingBottom: '50px' }}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body style={{ background: 'linear-gradient( rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)', borderRadius: '20px', display: 'flex' }}>
                <div style={{ flex: 1, paddingRight: '15px', borderRight: '1px solid #ccc' }}>
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col sm={6}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" name="title" value={values.title} onChange={handleChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" placeholder="Enter location" name="location" value={values.location} onChange={handleChange} />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={6}>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" name="start_date" value={values.start_date} onChange={handleChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" name="end_date" value={values.end_date} onChange={handleChange} />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={6}>
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control type="time" name="start_time" value={values.start_time} onChange={handleChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>End Time</Form.Label>
                        <Form.Control type="time" name="end_time" value={values.end_time} onChange={handleChange} />
                      </Col>
                    </Row>
                  </Form>
                </div>
                <div style={{ flex: 1, paddingLeft: '15px' }}>
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col sm={12}>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter amount" name="amount" value={values.amount} onChange={handleChange} />
                      </Col>
                    </Row>
                    {/* <Row className="mb-3">
                      <Col sm={12}>
                        <Form.Label>Progress</Form.Label>
                        <Form.Control type="number" placeholder="Enter progress" name="progress" value={values.progress} onChange={handleChange} />
                      </Col>
                    </Row> */}
                   
                    {/* <Row className="mb-3">
                      <Col sm={12}>
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" name="image" onChange={(e) => setValues({ ...values, image: e.target.files[0] })} />
                      </Col>
                    </Row> */}
                    <Row className="mb-3">
                      <Col sm={12}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter description" name="description" value={values.description} onChange={handleChange} />
                      </Col>
                    </Row>
                    <Button variant="primary" type="submit" className="w-50 rounded-pill align-items-center">
                      Create Event
                    </Button>
                  </Form>
                  {/* Buttons for alternative sign-up methods */}
                  {/* Add your buttons here */}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewEventForm;