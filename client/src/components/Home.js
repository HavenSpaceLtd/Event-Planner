import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button, Navbar } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';


function Home() {

const[users, setUsers] = useState([])
 const userDataString = sessionStorage.getItem('UserData');
 const id = sessionStorage.getItem('userId')
// Parse the stringified data back into an object
const userData = JSON.parse(userDataString);
const user = userData

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const access_token = sessionStorage.getItem('accessToken'); // Assuming you have the access token
      const response = await axios.get('/users', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      setUsers(response.data); // Assuming response.data is an array of users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  fetchUsers();


}, []);
console.log(users)

console.log(userData);
  const [tasks, setTasks] = useState(() => {
    
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: 1,
        title: 'Event Title',
        end_date: '',
        start_time: '',
        end_time: '',
        location: '',
        amount: '',
        status: 'Todo',
      },
    ];
  });
  
  useEffect(() => {
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  

  
  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
  
    const { destination, source } = result;
  
    if (destination.droppableId === source.droppableId) {
      return;
    }
  
    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find(task => task.id.toString() === result.draggableId);
  
    const prevStatus = movedTask.status;
  
    movedTask.status = destination.droppableId;
  
    switch (destination.droppableId) {
      case 'todo':
        movedTask.status = 'Todo';
        break;
      case 'inprogress':
        movedTask.status = 'InProgress';
        break;
      case 'completed':
        movedTask.status = 'Completed';
        break;
      case 'delayed':
        movedTask.status = 'Delayed';
        break;
      default:
        break;
    }
  
    setTasks(updatedTasks);
  
    if (prevStatus !== movedTask.status && movedTask.assignedTo && movedTask.assignedTo.length > 0) {
      let message = '';
      switch (movedTask.status) {
        case 'InProgress':
          message = `${movedTask.assignedTo.join(', ')} have started working on ${movedTask.taskTitle}`;
          break;
        case 'Completed':
          message = `${movedTask.assignedTo.join(', ')} have completed ${movedTask.taskTitle}`;
          break;
        case 'Delayed':
          message = `${movedTask.taskTitle} assigned to ${movedTask.assignedTo.join(', ')} has been delayed`;
          break;
        default:
          break;
      }
      if (message !== '') {
        alert(message);
      }
    }
  };
  

  const handleChange = (taskId, field, value) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleUpdate = async (taskId) => {
    try {
      const taskToCreate = tasks.find(task => task.id === taskId);
      console.log(taskToCreate);
      const startDate = new Date(taskToCreate.start_date);
      const endDate = new Date(taskToCreate.end_date);
    console.log(taskToCreate)
      
      const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
      const startDay = String(startDate.getDate()).padStart(2, '0');
      const startYear = startDate.getFullYear();
      const formattedStartDate = `${startMonth}/${startDay}/${startYear}`;

   
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDate.getDate()).padStart(2, '0');
      const endYear = endDate.getFullYear();
      const formattedEndDate = `${endMonth}/${endDay}/${endYear}`;

      let start_time = taskToCreate.start_time;
      let end_time = taskToCreate.end_time;
      
      // Split the time strings into hours and minutes
      let [start_hours, start_minutes] = start_time.split(':');
      let [end_hours, end_minutes] = end_time.split(':');
      
    // Create Date objects with year, month, day, hours, and minutes
let start_obj = new Date();
start_obj.setHours(start_hours);
start_obj.setMinutes(start_minutes);

let end_obj = new Date();
end_obj.setHours(end_hours);
end_obj.setMinutes(end_minutes);

// Format the Date objects into the desired format "%H:%M"
let start_formatted = start_obj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
let end_formatted = end_obj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });


      taskToCreate.owner_id = user.id; 
      taskToCreate.start_date = formattedStartDate; 
      taskToCreate.end_date = formattedEndDate; 
      taskToCreate.end_time = end_formatted
      taskToCreate.start_time = start_formatted
     
        
         

        const tasksResponse = await fetch('/tasks', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${user.access_token}`,
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(taskToCreate), 
        });
        if (!tasksResponse.ok) {
            throw new Error('Failed to save to tasks');
        }
        const tasksData = await tasksResponse.json();
        console.log('Tasks Response:', tasksData);

        alert('Task created Successfully');

    } catch (error) {
        console.error('Error:', error.message);
    }
    console.log(`Task with ID ${taskId} saved.`);
};



  const handleDelete = (taskId) => {
    if (taskId === 1) {
      console.log("Cannot delete the first card.");
      return;
    }
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    console.log(`Task with ID ${taskId} deleted.`);
  };

  const handleResetTask = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const originalTask = {
        id: tasks[taskIndex].id,
        title: 'New Event',
        start_date: '',
        start_time: '',
        end_time: '',
        location: '',
        amount: '',
        description: '',
        status:'Todo'
      };
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = originalTask;
      setTasks(updatedTasks);
    }
  };

  const handleAddTask = () => {
    const newTaskId = tasks.length + 1;
    const newTask = {
      id: newTaskId,
      title: 'New Event',
      start_date: '',
      start_time: '',
      end_time: '',
      location: '',
      amount: '',
      description: '',
      status:'Todo'
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    console.log("New task added.");
  };

  const handleNumParticipantsChange = (taskId, value) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, numParticipants: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleUserSelect = (userId, taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task && task.id === taskId && task.assignedTo && task.assignedTo.length < task.numParticipants) {
        const newAssignedTo = [...task.assignedTo, userId];
        return { ...task, assignedTo: newAssignedTo };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  
console.log(tasks)
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container fluid style={{ backgroundColor: 'bisque', padding: '20px' }}>
        <Navbar bg="light" expand="lg" style={{ borderRadius: '20px' }}>
          <Container>
            <Button
              variant="success"
              onClick={handleAddTask}
              className="mx-auto"
              style={{ backgroundColor: '#3e2723' }}
            >
              Add Task
            </Button>
          </Container>
        </Navbar>
        <Row>
          {['Todo', 'InProgress', 'Completed', 'Delayed'].map((status) => (
            <Col key={status}>
              
              <h3>{status}</h3>
              <hr style={{ borderColor: '#3e2723', backgroundColor: '#3e2723', height: '2px', margin: '5px 0' }} /> 
              <Droppable droppableId={status.toLowerCase()} key={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '100px' }}>
                    {tasks.map((task, index) => {
                      if (task.status.toLowerCase() === status.toLowerCase()) {
                        return (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="customDraggable"
                              >
                       <Card style={{ marginBottom: '20px', opacity: snapshot.isDragging ? 0.8 : 1, border: 'none' }}>
                                  <Card.Body>
                                  
                                    <Form.Group controlId={`task-${task.id}`}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label>{task.title}</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                        type="text"
                                        value={task.title}
                                        onChange={(e) => handleChange(task.id, 'title', e.target.value)}
                                      />
                                      </div>
                                      </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                          <Form.Label>Task Title</Form.Label>
                                        </div>
                                        <div style={{ flex: 2 }}>
                                          <Form.Control
                                            type="text"
                                            value={task.eventTitle}
                                            onChange={(e) => handleChange(task.id, 'eventTitle', e.target.value)}
                                          />
                                        </div>
                                      </div>  


                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label>Start Date</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                        type="date"
                                        value={task.start_date}
                                        onChange={(e) => handleChange(task.id, 'start_date', e.target.value)}
                                      />
                                      </div>
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label>End Date</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                        type="date"
                                        value={task.end_date}
                                        onChange={(e) => handleChange(task.id, 'end_date', e.target.value)}
                                      />
                                      </div>
                                      </div>

                                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label htmlFor="time">Start Time</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                           type="time"
                                           value={task.start_time}
                                           onChange={(e) => handleChange(task.id, 'start_time', e.target.value)}
                                      />
                                      </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label htmlFor="time">End Time</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                           type="time"
                                           value={task.end_time}
                                           onChange={(e) => handleChange(task.id, 'end_time', e.target.value)}
                                      />
                                      </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label htmlFor="time">Location</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                           type="text"
                                           value={task.location}
                                           onChange={(e) => handleChange(task.id, 'location', e.target.value)}
                                      />
                                      </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                              <Form.Label>Assigned To</Form.Label>
                                          </div>
                                          <div style={{ flex: 2 }}>
                                              <Form.Control
                                                  as="select"
                                                  value=""
                                                  onChange={(e) => handleUserSelect(e.target.value, task.id)}
                                              >
                                                  <option value="">Select User</option>
                                                  {users.map((user, index) => (
                                                      <option key={index} value={user.first_name}>{user.first_name}</option>
                                                  ))}
                                              </Form.Control>
                                              <div>
                                                  Assigned to: {task && task.assignedTo && task.assignedTo.length > 0 && (
                                                      task.assignedTo.map((user, index) => (
                                                          <span key={index}>{index > 0 ? ', ' : ''}{user.first_name}</span>
                                                      ))
                                                  )}
                                              </div>
                                          </div>
                                      </div>

                                
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label htmlFor="time">Amount</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                           type="text"
                                           value={task.amount}
                                           onChange={(e) => handleChange(task.id, 'amount', e.target.value)}
                                      />
                                      </div>
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label htmlFor="time">Description</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                           as="textarea"
                                           value={task.description}
                                           onChange={(e) => handleChange(task.id, 'description', e.target.value)}
                                      />
                                      </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label htmlFor="time">Status</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                           type="text"
                                           value={task.status}
                                           onChange={(e) => handleChange(task.id, 'description', e.target.value)}
                                      />
                                      </div>
                                      </div>
                                 
                                     
                                      <div className="d-flex justify-content-center align-items-center mt-2">
                                        <Button variant="primary" onClick={() => handleUpdate(task.id)}>Update</Button>
                                        {task.id !== 1 && (
                                          <div className="mx-2">
                                            <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
                                          </div>
                                        )}
                                        <Button variant="secondary" style={{ backgroundColor: '#3e2723', marginLeft: '5px' }} onClick={() => handleResetTask(task.id)}>Reset Task</Button>
                                      </div>
                                    </Form.Group>
                                  </Card.Body>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        );
                      }
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
          ))}
        </Row>
      </Container>
    </DragDropContext>
  );
}

export default Home;