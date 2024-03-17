import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

const Collaboration = () => {
  const [userData, setUserData] = useState(null);
  const [nonMatchingOwnerEvents, setNonMatchingOwnerEvents] = useState([]);
  const [collaboratedEvents, setCollaboratedEvents] = useState([]);
  const userId = sessionStorage.getItem('userId');
  const accessToken = sessionStorage.getItem('accessToken');

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(`/users/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCollaboratedEvents = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch('/collaborations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collaborated events');
      }

      const collaboratedEventsData = await response.json();
      setCollaboratedEvents(collaboratedEventsData);
      console.log(collaboratedEventsData);
    } catch (error) {
      console.error('Error fetching collaborated events:', error.message);
    }
  };

  const fetchEvents = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    try {
      const response = await fetch('/nonownedevents', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const eventsData = await response.json();
      const nonMatchingOwnerEvents = eventsData.filter(event => event.owner_id !== userId);
      setNonMatchingOwnerEvents(nonMatchingOwnerEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCollaboratedEvents();
    fetchEvents();
  }, []);

  const handleCollaborate = async (eventId) => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const response = await fetch('/collaborations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event_id: eventId, user_id: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to collaborate');
      }

      fetchCollaboratedEvents();
    } catch (error) {
      console.error('Error collaborating:', error);
    }
  };


  return (
    <Container className="my-5">
  <h1 className="mb-4" style={{ color: 'black' }}>User Collaboration Dashboard</h1>
  <Row className="justify-content-center">
    {userData && userData.events.map(event => (
      <Col key={event.id} md={12} className="mb-4">
        <Card className="mb-3" style={{ background: '#FFE4C4', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <Card.Body>
            <Card.Title style={{ fontFamily: 'Arial', fontSize: '24px', fontWeight: 'bold', color: 'black' }}>{event.title}</Card.Title>
            {/* Display event details */}
            <Row className="mb-3">
              <Col md={4}>
                <p style={{ color: 'black' }}><strong>Location:</strong> {event.location}</p>
              </Col>
              <Col md={4}>
                <p style={{ color: 'black' }}><strong>Start Date:</strong> {event.start_date}</p>
              </Col>
              <Col md={4}>
                <p style={{ color: 'black' }}><strong>End Date:</strong> {event.end_date}</p>
              </Col>
            </Row>
            <Card.Title className="mb-3" style={{ color: 'black' }}>Team Members</Card.Title>
            <div className="mb-3">
              {event.team_members.map(member => (
                <Card key={member.id} className="border-primary mb-3" style={{ borderRadius: '10px', background: '#fff', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                  <Card.Body className="text-center">
                    <div className="avatar bg-primary rounded-circle text-white mb-3" style={{ width: '80px', height: '80px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FaUser size={40} style={{ margin: '0 auto', flex: 'none' }} />
                    </div>
                    <p style={{ fontFamily: 'Arial', fontWeight: 'bold', color: 'black' }}>{member.first_name} {member.last_name}</p>
                    <p style={{ fontFamily: 'Arial', color: 'black' }}>{member.email}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
  <Container className="my-5">
    <h2 style={{ color: 'black' }}>All Events</h2>
    <Row className="justify-content-center">
      {nonMatchingOwnerEvents.map(event => {
        if (event.owner_id !== userId) {
          return (
            <Col key={event.id} md={12} className="mb-4">
              <Card className="mb-3" style={{ background: '#FFE4C4', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <Card.Body>
                  <Card.Title style={{ fontFamily: 'Arial', fontSize: '24px', fontWeight: 'bold', color: 'black' }}>{event.title}</Card.Title>
                  <Button onClick={() => handleCollaborate(event.id)} variant="light" style={{ fontFamily: 'Arial', fontWeight: 'bold', color: 'black', border: '2px solid #fff', borderRadius: '10px' }}>Collaborate</Button>
                </Card.Body>
              </Card>
            </Col>
          );
        }
        return null; 
      })}
    </Row>

    <Container className="my-5">
      <h2 style={{ color: 'black' }}>Collaborated Events</h2>
      <Row className="justify-content-center">
        {collaboratedEvents.length > 0 ? (
          collaboratedEvents.map(event => (
            <Col key={event.id} md={12} className="mb-4">
              <Card className="mb-3" style={{ background: '#FFE4C4', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <Card.Body>
                  <Card.Title style={{ fontFamily: 'Arial', fontSize: '24px', fontWeight: 'bold', color: 'black' }}>{event.event_title}</Card.Title>
                 
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col md={12} className="text-center">
            <p>No collaborated events found.</p>
          </Col>
        )}
      </Row>
    </Container>
  </Container>
</Container>
  );
};

export default Collaboration;