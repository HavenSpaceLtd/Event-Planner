import React, { useState } from 'react';
import { Card, Col, Container, Row, Form, Button, Navbar } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Home() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      projectTitle: 'Project title',
      taskTitle: 'Task Title',
      subtask: [], // Add subtask array
      assignedTo: [],
      startDate: '',
      endDate: '',
      priority: 'Urgent',
      status: 'Todo',
      numParticipants: 1 // Add numParticipants field
    },
  ]);
  
  const [selectedUsers, setSelectedUsers] = useState([]); // State to track selected users

  const users = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6', 'User 7', 'User 8', 'User 9', 'User 10'];

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { destination } = result;
    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find(task => task.id.toString() === result.draggableId);
    const prevStatus = movedTask.status;
    movedTask.status = destination.droppableId;
    setTasks(updatedTasks);

    const assignedUsers = movedTask.assignedTo;
    const taskTitle = movedTask.taskTitle;

    // Notification for each stage
    switch (destination.droppableId) {
      case 'inprogress':
        if (prevStatus !== 'InProgress' && assignedUsers.length > 0) {
          const usersString = assignedUsers.join(', ');
          alert(`${usersString} have started working on ${taskTitle}`);
        }
        break;
      case 'completed':
        if (prevStatus !== 'Completed' && assignedUsers.length > 0) {
          const usersString = assignedUsers.join(', ');
          alert(`${usersString} have completed ${taskTitle}`);
        }
        break;
      case 'delayed':
        if (prevStatus !== 'Delayed' && assignedUsers.length > 0) {
          const usersString = assignedUsers.join(', ');
          alert(`Task ${taskTitle} assigned to ${usersString} has been delayed`);
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (taskId, field, value) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleUpdate = (taskId) => {
    // Logic to save the changes to the task
    console.log(`Task with ID ${taskId} updated.`);
    alert('Task Updated Successfully');
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

  const handleAddTask = () => {
    const newTaskId = tasks.length + 1;
    const newTask = {
      id: newTaskId,
      projectTitle: 'New Project',
      taskTitle: 'New Task',
      subtask: [], // Add subtask array
      assignedTo: [],
      startDate: '',
      endDate: '',
      priority: 'Urgent',
      status: 'Todo',
      numParticipants: 1 // Add numParticipants field
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container fluid style={{ backgroundColor: 'bisque', padding: '20px' }}>
        <Navbar bg="light" expand="lg">
          <Container>
            {/* <Navbar.Brand>Plan Your Project to Work Efficiently</Navbar.Brand> */}
            <Button variant="success" onClick={handleAddTask} className="mx-auto">Add Task</Button>
          </Container>
        </Navbar>
        <Row>
          {['Todo', 'InProgress', 'Completed', 'Delayed'].map((status) => (
            <Col key={status}>
              <h3>{status}</h3>
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
                                <Card style={{ opacity: snapshot.isDragging ? 0.8 : 1 }}>
                                  <Card.Body>
                                    <Form.Group controlId={`task-${task.id}`}>
                                      <Form.Label>Project Title</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={task.projectTitle}
                                        onChange={(e) => handleChange(task.id, 'projectTitle', e.target.value)}
                                      />
                                      <Form.Label>Task Title</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={task.taskTitle}
                                        onChange={(e) => handleChange(task.id, 'taskTitle', e.target.value)}
                                      />
                                      {/* Subtask input field below task title */}
                                      <Form.Label>Subtask</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={task.subtask.join(', ')}
                                        onChange={(e) => handleChange(task.id, 'subtask', e.target.value.split(','))}
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
                                          <option key={index} value={user}>{user}</option>
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
                                      <Button variant="primary" onClick={() => handleUpdate(task.id)}>Update</Button>{' '}
                                      {task.id !== 1 && <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>}
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
