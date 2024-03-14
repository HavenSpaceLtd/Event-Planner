import React, { useState, useEffect } from 'react';
import { Card,Modal, Col, Container, Row, Form, Button, Navbar } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from './AuthContext';
import ResourceForm from './ResourceForm';

import BudgetForm from './BudgetForm';
import ExpenseForm from './ExpenseForm'

function Home() {

  const { users } = useAuth();
 console.log(users)
 const userDataString = sessionStorage.getItem('userData');

// Parse the stringified data back into an object
const userData = JSON.parse(userDataString);
const user = userData
// Now userData contains the user data retrieved from sessionStorage
console.log(userData);
  const [tasks, setTasks] = useState(() => {
    // Initialize tasks from localStorage or use default if no tasks are saved
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
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
      },
    ];
  });
  
  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
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
 const [showResourceForm, setShowResourceForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const handleAddResource = (taskId) => {
    setShowResourceForm(true);
  };

  // Handler function for adding expenses
  const handleAddExpense = (taskId) => {
    setShowExpenseForm(true);
  };

  // Handler function for setting the budget
  const handleSetBudget = (taskId) => {
    setShowBudgetForm(true);
  };


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
                                      <Form.Label>Event Title</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={task.eventTitle}
                                        onChange={(e) => handleChange(task.id, 'eventTitle', e.target.value)}
                                      />
                                      <Form.Label>Task Title</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={task.taskTitle}
                                        onChange={(e) => handleChange(task.id, 'taskTitle', e.target.value)}
                                      />
                                      <Form.Label>Number of Participants</Form.Label>
                                      <Form.Control
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={task.numParticipants}
                                        onChange={(e) => handleNumParticipantsChange(task.id, e.target.value)}
                                      />
                                      <Form.Label>Assigned To</Form.Label>
                                      <Form.Control
                                          as="select"
                                          value=""
                                          onChange={(e) => handleUserSelect(e.target.value, task.id)}
                                        >
                                          <option value="">Select User</option>
                                          {users.map((user, index) => (
                                            <option key={index} value={user.name}>{user.name}</option>
                                          ))}
                                        </Form.Control>
                                                                            <div>
                                        Assigned to: {task.assignedTo.map((user, index) => (
                                          <span key={index}>{index > 0 ? ', ' : ''}{user}</span>
                                        ))}
                                      </div>
                                      <Form.Label>Start Date</Form.Label>
                                      <Form.Control
                                        type="date"
                                        value={task.startDate}
                                        onChange={(e) => handleChange(task.id, 'startDate', e.target.value)}
                                      />
                                      <Form.Label>End Date</Form.Label>
                                      <Form.Control
                                        type="date"
                                        value={task.endDate}
                                        onChange={(e) => handleChange(task.id, 'endDate', e.target.value)}
                                      />
                                      <Form.Label>Priority</Form.Label>
                                      <Form.Control
                                        as="select"
                                        value={task.priority}
                                        onChange={(e) => handleChange(task.id, 'priority', e.target.value)}
                                      >
                                        <option value="Urgent">Urgent</option>
                                        <option value="Not Urgent">Not Urgent</option>
                                      </Form.Control>
                                      <Form.Label>Status</Form.Label>
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
                                    <div>     <Button variant="link" onClick={handleAddResource} className="mr-3">Resources</Button>
        {/* Replace your existing link for expenses with button and add onClick handler */}
        <Button variant="link" onClick={handleAddExpense} className="mr-3">Expenses</Button>
        {/* Replace your existing button for budget with button and add onClick handler */}
        <Button variant="link" onClick={handleSetBudget} className="mr-3">Budget</Button>
        {/* Modal for adding resources */}
        <Modal show={showResourceForm} onHide={() => setShowResourceForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Resource</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ResourceForm onSubmit={() => setShowResourceForm(false)} />
          </Modal.Body>
        </Modal>
        {/* Modal for adding expenses */}
        <Modal show={showExpenseForm} onHide={() => setShowExpenseForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ExpenseForm onSubmit={() => setShowExpenseForm(false)} />
          </Modal.Body>
        </Modal>
        {/* Modal for setting the budget */}
        <Modal show={showBudgetForm} onHide={() => setShowBudgetForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Set Budget</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BudgetForm onSubmit={() => setShowBudgetForm(false)} />
          </Modal.Body>
        </Modal> </div>
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
