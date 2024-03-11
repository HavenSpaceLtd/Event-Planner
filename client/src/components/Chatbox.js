import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Image, Dropdown, Card } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const ChatBox = () => {
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [pinnedContacts, setPinnedContacts] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const contacts = [
    { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/50' },
    { id: 4, name: 'Michael Brown', avatar: 'https://via.placeholder.com/50' },
    { id: 5, name: 'Emma Wilson', avatar: 'https://via.placeholder.com/50' },
    { id: 6, name: 'Daniel Clark', avatar: 'https://via.placeholder.com/50' },
    { id: 7, name: 'Olivia Taylor', avatar: 'https://via.placeholder.com/50' },
    { id: 8, name: 'Matthew White', avatar: 'https://via.placeholder.com/50' },
    { id: 9, name: 'Emily Walker', avatar: 'https://via.placeholder.com/50' },
    { id: 10, name: 'David Miller', avatar: 'https://via.placeholder.com/50' },
  ];

  const chatHistory = {
    1: [
      { id: 1, text: 'Hi John, how are you? 😊', sender: 'Me', timestamp: '10:00 AM' },
      { id: 2, text: 'Hey, I\'m good! How about you?', sender: 'John Doe', timestamp: '10:02 AM' },
    ],
    2: [
      { id: 1, text: 'Hi Jane, how\'s it going?', sender: 'Me', timestamp: '11:00 AM' },
      { id: 2, text: 'Hey there! I\'m doing great, thanks for asking. 🌟', sender: 'Jane Smith', timestamp: '11:03 AM' },
    ],
    3: [
      { id: 1, text: 'Hello Alice, what\'s up?', sender: 'Me', timestamp: '12:00 PM' },
      { id: 2, text: 'Not much, just chilling. How about you?', sender: 'Alice Johnson', timestamp: '12:05 PM' },
    ],
    4: [
      { id: 1, text: 'Hey Michael, how\'s your day going?', sender: 'Me', timestamp: '1:00 PM' },
      { id: 2, text: 'Pretty good! Just busy with work.', sender: 'Michael Brown', timestamp: '1:05 PM' },
    ],
    5: [
      { id: 1, text: 'Hi Emma, are you free this weekend?', sender: 'Me', timestamp: '2:00 PM' },
      { id: 2, text: 'Yes, I am. Do you want to hang out?', sender: 'Emma Wilson', timestamp: '2:05 PM' },
    ],
    6: [
      { id: 1, text: 'Hey Daniel, how\'s your project going?', sender: 'Me', timestamp: '3:00 PM' },
      { id: 2, text: 'It\'s going well. Making good progress.', sender: 'Daniel Clark', timestamp: '3:05 PM' },
    ],
    7: [
      { id: 1, text: 'Hi Olivia, did you watch the latest episode?', sender: 'Me', timestamp: '4:00 PM' },
      { id: 2, text: 'Yes, it was amazing! Can\'t wait for the next one.', sender: 'Olivia Taylor', timestamp: '4:05 PM' },
    ],
    8: [
      { id: 1, text: 'Hey Matthew, how\'s your new job?', sender: 'Me', timestamp: '5:00 PM' },
      { id: 2, text: 'It\'s going great. Thanks for asking.', sender: 'Matthew White', timestamp: '5:05 PM' },
    ],
    9: [
      { id: 1, text: 'Hi Emily, are you coming to the party?', sender: 'Me', timestamp: '6:00 PM' },
      { id: 2, text: 'Yes, I\'ll be there. Looking forward to it!', sender: 'Emily Walker', timestamp: '6:05 PM' },
    ],
    10: [
      { id: 1, text: 'Hey David, how\'s it going?', sender: 'Me', timestamp: '7:00 PM' },
      { id: 2, text: 'I\'m doing good. Thanks for asking.', sender: 'David Miller', timestamp: '7:05 PM' },
    ],
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') {
      return;
    }
    const newMessage = {
      id: messages[selectedContact.id].length + 1,
      text: inputMessage,
      sender: 'Me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages({ ...messages, [selectedContact.id]: [...messages[selectedContact.id], newMessage] });
    setInputMessage('');
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    if (!messages[contact.id]) {
      setMessages({ ...messages, [contact.id]: chatHistory[contact.id] || [] });
    }
  };

  const handlePinContact = (contact) => {
    if (pinnedContacts.includes(contact.id)) {
      setPinnedContacts(pinnedContacts.filter(id => id !== contact.id));
    } else {
      setPinnedContacts([contact.id, ...pinnedContacts]);
    }
  };

  const handleDeleteContact = (contact) => {
    // Implement deletion logic here
  };

  const handleEmojiSelect = (emoji) => {
    const sym = emoji.unified.split("-");
    const codesArray = sym.map(el => "0x" + el);
    const emojiString = String.fromCodePoint(...codesArray);
    setInputMessage(inputMessage + emojiString);
  };

  return (
    <Container fluid style={{ height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      <Row style={{ height: '100%' }}>
        <Col sm={3} style={{ backgroundColor: '#dcdcdc', padding: '20px', borderRight: '1px solid #bbb', overflowY: 'auto' }}>
          {selectedContact ? (
            <Button variant="link" onClick={() => setSelectedContact(null)} style={{ color: '#333', marginBottom: '20px' }}>
              <FaArrowLeft /> Back
            </Button>
          ) : (
            <h3 style={{ color: '#333', marginBottom: '20px' }}>Contacts</h3>
          )}
          <ListGroup>
            {contacts.map(contact => (
              <ListGroup.Item
                key={contact.id}
                action
                onClick={() => handleContactSelect(contact)}
                active={selectedContact && selectedContact.id === contact.id}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', backgroundColor: selectedContact && selectedContact.id === contact.id ? '#bbb' : 'transparent', borderRadius: '5px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={contact.avatar} roundedCircle style={{ marginRight: '10px', width: '40px', height: '40px' }} />
                  <span style={{ color: '#333', fontSize: '16px' }}>{contact.name}</span>
                </div>
                <Dropdown>
                  <Dropdown.Toggle variant="link" id={`dropdown-${contact.id}`} style={{ color: '#333' }}>
                    <span style={{ fontSize: '20px' }}></span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handlePinContact(contact)}>{pinnedContacts.includes(contact.id) ? 'Unpin' : 'Pin'}</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteContact(contact)}>Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col sm={9} style={{ backgroundColor: '#f5f5f5', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {selectedContact ? (
            <>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column-reverse', marginBottom: '20px' }}>
                {messages[selectedContact.id].slice().reverse().map((message, index) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.sender === 'Me' ? 'flex-end' : 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: message.sender === 'Me' ? '#128C7E' : '#333',
                        color: '#fff',
                        borderRadius: message.sender === 'Me' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                        padding: '10px 15px',
                        maxWidth: '70%',
                        alignSelf: message.sender === 'Me' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{message.text}</p>
                      <small style={{ textAlign: 'right' }}>{message.timestamp}</small>
                    </div>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSendMessage} style={{ marginBottom: '20px' }}>
                <Form.Group controlId="messageInput" style={{ display: 'flex', marginBottom: '10px' }}>
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    style={{ flex: '1', borderRadius: '20px 20px 0 20px', borderTop: 'none' }}
                  />
                  <Button
                    variant="link"
                    style={{ color: '#333', fontSize: '20px', alignSelf: 'center' }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    😀
                  </Button>
                  {showEmojiPicker && (
                    <Card style={{ position: 'absolute', bottom: '65px', right: '10px', width: '320px', borderRadius: '20px' }}>
                    <Card.Body>
                    <Picker 
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        style={{
                        position:"absolute",
                        marginTop: "465px",
                        marginLeft: -40,
                        maxWidth: "320px",
                        borderRadius: "20px",
                      }}
                      theme="dark"
                    />
                    </Card.Body>
                  </Card>
                  )}
                  <Button variant="primary" type="submit" style={{ borderRadius: '20px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>Send</Button>
                </Form.Group>
              </Form>
            </>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '50px', color: '#333' }}>Select a contact to start chatting</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatBox;