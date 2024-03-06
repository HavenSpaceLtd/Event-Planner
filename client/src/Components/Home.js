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

  const users = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6', 'User 7', 'User 8', 'User 9', 'User 10'];

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { destination, source } = result;

    if (destination.droppableId === source.droppableId) {
      return;
    }

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find(task => task.id.toString() === result.draggableId);

    // Set the previous status
    const prevStatus = movedTask.status;

    // Update the status of the moved task
    movedTask.status = destination.droppableId;

    // If the destination is 'Todo', set the status to 'Todo'
    if (destination.droppableId === 'todo') {
      movedTask.status = 'Todo';
    }

    // If the destination is 'inprogress', set the status to 'InProgress'
    if (destination.droppableId === 'inprogress') {
      movedTask.status = 'InProgress';
    }

    // If the destination is 'completed', set the status to 'Completed'
    if (destination.droppableId === 'completed') {
      movedTask.status = 'Completed';
    }

    // If the destination is 'delayed', set the status to 'Delayed'
    if (destination.droppableId === 'delayed') {
      movedTask.status = 'Delayed';
    }

    setTasks(updatedTasks);

    // Notify the user about the status change
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
  };

  const handleChange = (taskId, field, value) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleUpdate = (taskId) => {
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

  const handleResetTask = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const originalTask = {
        id: tasks[taskIndex].id,
        projectTitle: 'Project title',
        taskTitle: 'Task Title',
        subtask: [], // Add subtask array
        assignedTo: [],
        startDate: '',
        endDate: '',
        priority: 'Urgent',
        status: 'Todo',
        numParticipants: 1 // Add numParticipants field
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
                                <Card style={{ marginBottom: '20px', opacity: snapshot.isDragging ? 0.8 : 1, border: 'none' }}></Card>
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
                                      <div className="d-flex justify-content-center align-items-center mt-2">
                                            <Button variant="primary" onClick={() => handleUpdate(task.id)}>Update</Button>
                                            {task.id !== 1 && (
                                              <div className="mx-2"> {/* Added mx-2 class for margin-x: 2 */}
                                                <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
                                              </div>
                                            )}
                                            <Button variant="secondary" style={{ backgroundColor: '#3e2723', marginLeft: '5px' }} onClick={() => handleResetTask(task.id)}>Reset Task</Button> {/* Added backgroundColor: '#3e2723' */}
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
