import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Dropdown } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');

    if (!token || !userId) {
      alert('Please log in first');
      return;
    }

   
    fetch('/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    })
    .then(data => {
      
      const filteredUsers = data.filter(user => user.id !== parseInt(userId));
      setUsers(filteredUsers);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });

    
    fetch('/communications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    })
    .then(data => {
     
      setMessages(data);
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
  }, []);

  
  const uniqueContacts = Array.from(new Set(messages.map(msg => msg.sender_id === parseInt(sessionStorage.getItem('userId')) ? msg.recipient_id : msg.sender_id)));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || !selectedContact) {
      return;
    }
  
    const token = sessionStorage.getItem('accessToken');
    const senderId = sessionStorage.getItem('userId');
    const recipientId = selectedContact.id;
    const messageData = {
      message: inputMessage,
      recipient_id: recipientId,
      sender_id: senderId,
    };

    fetch('/communications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    })
    .then(data => {
      const newMessage = {
        id: data.id,
        message: inputMessage,
        sender_id: senderId,
        recipient_id: recipientId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleEmojiSelect = (emoji) => {
    const sym = emoji.unified.split("-");
    const codesArray = sym.map(el => "0x" + el);
    const emojiString = String.fromCodePoint(...codesArray);
    setInputMessage(inputMessage + emojiString);
  };

  return (
    <Container fluid style={{ height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif', padding: '100px' }}>
      <Row style={{ height: '100%' }}>
        <Col sm={3} style={{ backgroundColor: '#272727', padding: '20px', borderRight: '1px solid #333', overflowY: 'auto', maxHeight: 'calc(100vh - 56px)' }}>
          <Dropdown style={{ marginBottom: '20px' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-all-users">
              Choose a Contact
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ backgroundColor: '#fff' }}>
              {users.map(user => (
                <Dropdown.Item key={user.id} onClick={() => handleContactSelect(user)} style={{ color: '#333' }}>
                  {`${user.first_name} ${user.last_name}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Contacts</h3>
          {uniqueContacts.map(contactId => {
            const contact = users.find(user => user.id === contactId);
            if (contact) {
              return (
                <div 
                  key={contact.id} 
                  onClick={() => handleContactSelect(contact)} 
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: selectedContact && selectedContact.id === contact.id ? '#333' : 'transparent',
                    borderRadius: '5px'
                  }}
                >
                  <div style={{ 
                    backgroundColor: '#ccc', 
                    borderRadius: '50%', 
                    width: '40px', 
                    height: '40px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginRight: '10px' 
                  }}>
                    <span style={{ color: '#333', fontWeight: 'bold' }}>{`${contact.first_name[0]}${contact.last_name[0]}`}</span>
                  </div>
                  <div style={{ color: '#fff' }}>{`${contact.first_name} ${contact.last_name}`}</div>
                </div>
              );
            }
            return null;
          })}
        </Col>
        <Col sm={9} style={{ backgroundColor: '#ccc', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {selectedContact && (
            <div style={{ marginBottom: '20px' }}>
              <Button variant="link" onClick={() => setSelectedContact(null)} style={{ color: '#333', marginBottom: '10px' }}>
                <FaArrowLeft /> Back
              </Button>
              <h3 style={{ color: '#333' }}>{`${selectedContact.first_name} ${selectedContact.last_name}`}</h3>
            </div>
          )}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column-reverse', marginBottom: '20px' }}>
            {messages
              .filter(msg => {
                if (!selectedContact) return false;
                return (
                  (msg.sender_id === selectedContact.id && msg.recipient_id === parseInt(sessionStorage.getItem('userId'))) ||
                  (msg.sender_id === parseInt(sessionStorage.getItem('userId')) && msg.recipient_id === selectedContact.id)
                );
              })
              .slice()
              .reverse()
              .map((message, index) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.sender_id === parseInt(sessionStorage.getItem('userId')) ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: message.sender_id === parseInt(sessionStorage.getItem('userId')) ? '#128C7E' : '#333',
                      color: '#fff',
                      borderRadius: message.sender_id === parseInt(sessionStorage.getItem('userId')) ? '15px 15px 0 15px' : '15px 15px 15px 0',
                      padding: '10px 15px',
                      maxWidth: '70%',
                      alignSelf: message.sender_id === parseInt(sessionStorage.getItem('userId')) ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <p style={{ margin: '0', fontWeight: 'bold' }}>{message.message}</p>
                    <small style={{ textAlign: 'right' }}>{message.timestamp}</small>
                  </div>
                </div>
              ))}
          </div>
          <Form onSubmit={handleSendMessage} style={{ marginBottom: '20px' }}>
            <Form.Group controlId="messageInput" style={{ display: 'flex', marginBottom: '10px', backgroundColor: '#ccc' }}>
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{ flex: '1', borderRadius: '20px 20px 0 20px', borderTop: 'none', backgroundColor: '#ccc' }}
            />
            <Button
              variant="link"
              style={{ color: '#333', fontSize: '20px', alignSelf: 'center' }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😀
            </Button>
            {showEmojiPicker && (
              <Card style={{ 
                position: 'absolute', 
                bottom: showEmojiPicker ? '-90px' : '-340px', 
                right: '250px', 
                width: '420px', 
                borderRadius: '20px', 
                transition: 'bottom 0.3s ease-in-out',
                zIndex: 999,
              }}>
                <Card.Body>
                  <Picker 
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="dark"
                  />
                </Card.Body>
              </Card>
            )}
            <Button variant="primary" type="submit" style={{ borderRadius: '20px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>Send</Button>
          </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatBox;