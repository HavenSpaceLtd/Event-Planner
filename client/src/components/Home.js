import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button, Navbar } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from './AuthContext';

function Home() {

  const { users, combinedData } = useAuth();
 console.log(users)
 const userDataString = sessionStorage.getItem('userData');

// Parse the stringified data back into an object
const userData = JSON.parse(userDataString);
const user = userData
// Now userData contains the user data retrieved from sessionStorage
console.log(userData);
console.log(users)
const [tasks, setTasks] = useState([]);

useEffect(() => {
  const fetchTasks = async () => {
    return combinedData ? combinedData.filter(task => task.assignedTo === users.first_name) : [
      {
        id: 1,
        eventTitle: 'Event Title',
        taskTitle: 'Task Title',
        assignedTo: [],
        startDate: new Date().toISOString().split('T')[0], // Default to today's date
        endDate: '', // Update this with a default value if needed
        priority: 'Urgent',
        status: 'Todo',
        numParticipants: 1
      }
    ];
  };

  fetchTasks(); // Call the fetchTasks function

  // Add any cleanup code if needed

}, [combinedData, user.name]);

useEffect(() => {
  // Define the formatCombinedData function inside the useEffect callback
  const formatCombinedData = (data) => {
    if (!data || data.length === 0) return []; // Return empty array if data is falsy or empty

    return data.map(task => ({
      ...task,
      startDate: formatDate(task.startDate),
      endDate: formatDate(task.endDate),
      start_date: formatDate(task.start_date),
      end_date: formatDate(task.end_date)
    }));
  };

  // Load tasks from combinedData when it changes
  if (combinedData && combinedData.length > 0) {
    const formattedData = formatCombinedData(combinedData);
    setTasks(formattedData);

    localStorage.setItem('formattedTasks', JSON.stringify(formattedData));
  }
}, [combinedData]); // Only include combinedData as a dependency

// Define formatDate function outside the useEffect
const formatDate = (dateString) => {
  if (!dateString) return ''; // Return empty string if dateString is falsy

  // Convert the dateString to a Date object
  const date = new Date(dateString);

  // Extract year, month, and day
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0'); // Adding 1 because month starts from 0
  const day = `${date.getUTCDate()}`.padStart(2, '0');

  // Format the date as "yyyy-MM-dd"
  return `${year}-${month}-${day}`;
};


  
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

  if (destination.droppableId === 'todo') {
    movedTask.status = 'Todo';
  }

  if (destination.droppableId === 'inprogress') {
    movedTask.status = 'InProgress';
  }

  if (destination.droppableId === 'completed') {
    movedTask.status = 'Completed';
  }

  if (destination.droppableId === 'delayed') {
    movedTask.status = 'Delayed';
  }

  setTasks(updatedTasks);

  if (prevStatus !== movedTask.status && movedTask.assignedTo.length > 0) {
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

  // Add PUT request to update the task status
  try {
    const response = await fetch(`/update_task_status/${movedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newStatus: destination.droppableId // Assuming the droppableId represents the new status
      })
    });
    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    // Handle error as needed
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

        // Send data to /events endpoint
        const eventsResponse = await fetch('/events', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${user.access_token}`,
    
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(taskToCreate), // Send only the task to be created
        });
        if (!eventsResponse.ok) {
            throw new Error('Failed to save to events');
        }
        const eventData = await eventsResponse.json();
        console.log('Events Response:', eventData);

        // Send data to /tasks endpoint
        const tasksResponse = await fetch('/tasks', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${user.access_token}`,
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(taskToCreate), // Send only the task to be created
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



const handleDelete = async (taskId) => {
  if (taskId === 1) {
    console.log("Cannot delete the first card.");
    return;
  }

  try {
    // Send a DELETE request to the server
    const response = await fetch(`/tasksdelete/${taskId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${user.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    // If the request is successful, update the tasks state
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    console.log(`Task with ID ${taskId} deleted.`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};


  const handleResetTask = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const originalTask = {
        id: tasks[taskIndex].id,
        eventTitle: 'Event Title',
        taskTitle: 'Task Title',
        assignedTo: [],
        startDate: '',
        endDate: '',
        priority: 'Urgent',
        status: 'Todo',
        numParticipants: 1
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
      eventTitle: 'New Event',
      taskTitle: 'New Task',
      assignedTo: [],
      startDate: '',
      endDate: '',
      priority: 'Urgent',
      status: 'Todo',
      numParticipants: 1
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
      if (task.id === taskId && task.assignedTo.length < task.numParticipants) {
        const newAssignedTo = [...task.assignedTo, userId];
        return { ...task, assignedTo: newAssignedTo };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
console.log(tasks)
console.log(user)
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
                                          <Form.Label>Event Title</Form.Label>
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
                                      <Form.Label>Task Title</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                        type="text"
                                        value={task.taskTitle}
                                        onChange={(e) => handleChange(task.id, 'taskTitle', e.target.value)}
                                      />
                                      </div>
                                    </div> 
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label>Number of Participants</Form.Label>
                                      </div>
                                    <div style={{ flex: 2 }}>
                                      <Form.Control
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={task.numParticipants}
                                        onChange={(e) => handleNumParticipantsChange(task.id, e.target.value)}
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
                                          Assigned to: {
                                            task.assignedTo
                                            ? (
                                              task.assignedTo.map((user, index) => (
                                                <span key={index}>{index > 0 ? ', ' : ''}{user}</span>
                                              ))
                                            ) : (
                                              <span>No one assigned</span>
                                            )
                                          }
                                        </div>
                                        </div>
                                      </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label>Start Date</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                        type="date"
                                        value={task.startDate}
                                        onChange={(e) => handleChange(task.id, 'startDate', e.target.value)}
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
                                        value={task.endDate}
                                        onChange={(e) => handleChange(task.id, 'endDate', e.target.value)}
                                      />
                                      </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label>Priority</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                        as="select"
                                        value={task.priority}
                                        onChange={(e) => handleChange(task.id, 'priority', e.target.value)}
                                      >
                                        <option value="Urgent">Urgent</option>
                                        <option value="Not Urgent">Not Urgent</option>
                                      </Form.Control>
                                      </div>
                                      </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                     <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                      <Form.Label>Status</Form.Label>
                                      </div>
                                      <div style={{ flex: 2 }}>
                                      <Form.Control
                                        as="select"
                                        value={task.status}
                                        onChange={(e) => handleChange(task.id, 'status', e.target.value)}
                                      >
                                        <option value="Todo">Todo</option>
                                        <option value="InProgress">InProgress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Delayed">Delayed</option>
                                      </Form.Control>
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
