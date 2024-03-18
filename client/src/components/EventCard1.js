import React, { useState, useEffect } from "react";
import { Modal, Button, Tooltip, OverlayTrigger, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EventCard1.css";
import { FaExclamationTriangle } from 'react-icons/fa';

import ResourceForm from './ResourceForm';
import BudgetForm from './BudgetForm';
import ExpenseForm from './ExpenseForm';

function EventCard1({ id, title, location, startDate, endDate, ownerId, userData, expenditure, activeToken, currentTeamMembers, amount, update }) {
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [eventData, setEventData] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [newTaskData, setNewTaskData] = useState({
        title: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        location: "",
        amount: "",
        description: "",
        event_id: id
    });


    const fetchEventData = async () => {
        try {
            const response = await fetch(`/events/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${activeToken}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch event data");
            }
            const eventData = await response.json();
            setEventData(eventData);
            setTeamMembers(eventData.team_members || []);
        } catch (error) {
            console.error("Error fetching event data:", error);
        }
    };

    useEffect(() => {
        fetchEventData();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setShowForm(false);
    };

    const handleShowModal = () => setShowModal(true);

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

        setNewTaskData((prevValues) => ({
            ...prevValues,
            [name]: formattedValue,
        }));
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${activeToken}`
                },
                body: JSON.stringify({
                    ...newTaskData,
                    event_id: id
                })
            });
            if (!response.ok) {
                throw new Error("Failed to add new task");
            }

            fetchEventData();

            handleCloseModal();
        } catch (error) {
            console.error("Error adding new task:", error);
        }
    };

    const handleAssignTask = async (userId, taskId) => {
        try {
            const response = await fetch("/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${activeToken}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    task_id: taskId
                })
            });
            if (!response.ok) {
                throw new Error("Failed to assign task to user");
            }

            fetchEventData();
        } catch (error) {
            console.error("Error assigning task to user:", error);
        }
    };

    const handleTeamMemberSelect = (taskId, userId) => {
        handleAssignTask(userId, taskId);
    };

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchAndFilterUsers = async () => {
            try {
                const response = await fetch('/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${activeToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();

                const filteredUsers = data.filter(user => {
                    return !teamMembers.some(member => member.email === user.email);
                });

                setUsers(filteredUsers);
                update();
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAndFilterUsers();
        update();
    }, [teamMembers, activeToken]);

    const handleAssignTeamMember = async (ownerId, id) => {
        try {
            const response = await fetch("/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${activeToken}`
                },
                body: JSON.stringify({
                    user_id: ownerId,
                    event_id: id
                })
            });
            if (!response.ok) {
                throw new Error("Failed to assign task to user");
            }

            fetchEventData();
            update();
        } catch (error) {
            console.error("Error assigning task to user:", error);
        }
    };

    const [priorities, setPriorities] = useState({});

    const handleDeleteEvent = async () => {
        try {
            const response = await fetch(`/events/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${activeToken}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to delete event");
            }
            update();
            alert('Event deleted successfully!');


        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handlePriorityChange = async (taskId, newPriority) => {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}` // Assuming you have the activeToken available
                },
                body: JSON.stringify({
                    priority: newPriority
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update priority');
            }

            setPriorities(prevPriorities => ({
                ...prevPriorities,
                [taskId]: newPriority
            }));
            update();
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };


    const [showResourceForm, setShowResourceForm] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showBudgetForm, setShowBudgetForm] = useState(false);

    // Handler function for adding resource
    const handleAddResource = () => {
        setShowResourceForm(true);
    };

    // Handler function for adding expense
    const handleAddExpense = () => {
        setShowExpenseForm(true);
    };

    // Handler function for setting the budget
    const handleSetBudget = () => {
        setShowBudgetForm(true);
    };

    return (
        <>
            {userData ? (
                <>
                    <div className="card mt-5 mb-5 ms-5 bg-light" style={{ width: "250px" }}>
                        <div className="card-body" onClick={handleShowModal}>
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">ID: {id}</p>
                            <p className="card-text">Location: {location}</p>
                            <p className="card-text">Start Date: {startDate}</p>
                            <p className="card-text">End Date: {endDate}</p>
                            <p className="card-text">Total Budget: KSH{amount.toLocaleString()}</p>
                            <p className="card-text">Available Budget: KSH{(amount - expenditure).toLocaleString()}</p>
                            <div id={id} className="progress mt-2 mb-3">
                                <div
                                    id={id}
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${eventData.average_progress}%` }}
                                    aria-valuenow={`${eventData.average_progress}%`}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    Progress: {eventData.average_progress}%
                                </div>
                            </div>

                        </div>
                        <div className="d-flex justify-content-center"> {/* Center the button */}
                            {(!eventData.tasks || eventData.tasks.length === 0) && (!eventData.team_members || eventData.team_members.length === 0) && (
                                <button onClick={handleDeleteEvent} className="btn btn-danger mb-2" style={{ width: "50px" }}>X</button>
                            )}
                        </div>
                    </div>

                    <Modal show={showModal} onHide={handleCloseModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="team-members">
                                <h4>Team Members:</h4>
                                <div className="d-flex align-content-end flex-wrap" >
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="list-group-item px-2">{member.first_name} {member.last_name}
                                            <div className="mt-2 mb-2 ms-5" id={member.id} ><img className="border border-secondary rounded" id={member.id} src={member.image ? member.image.replace("../client/public", "") : "/images/default.jpg"} style={{ height: "50px" }}></img></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Dropdown style={{ marginBottom: '20px', marginLeft: '160px', marginTop: '20px' }}>
                                <Dropdown.Toggle variant="success" id="dropdown-all-users">
                                    Add Team Member
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ backgroundColor: '#fff' }}>
                                    {users.map(user => (
                                        <Dropdown.Item key={user.id} style={{ color: '#333' }} onClick={() => handleAssignTeamMember(user.id, id)}>
                                            {`${user.first_name} ${user.last_name}`}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            <div className="task-list">
                                <h4>Assigned Tasks:</h4>
                                <ul className="list-group">
                                    {eventData.assigned_tasks &&
                                        eventData.assigned_tasks.map((item) => (
                                            <li key={item.task.id} className="list-group-item" style={{ padding: '5px 10px', marginBottom: '5px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {item.task.priority === 'High' && (
                                                        <FaExclamationTriangle style={{ color: 'red', marginRight: '5px' }} />
                                                    )}
                                                    <span>{item.task.title}</span>
                                                    <div style={{ marginLeft: 'auto' }}>
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="light" id={`dropdown-priority-${item.task.id}`}>
                                                                {"" || ''}
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => handlePriorityChange(item.task.id, 'Low')}>Low</Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handlePriorityChange(item.task.id, 'Medium')}>Medium</Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handlePriorityChange(item.task.id, 'High')}>High</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>



                            <div className="task-list">
                                <h4>Unassigned Tasks:</h4>
                                {eventData.unassigned_tasks &&
                                    eventData.unassigned_tasks.map((task) => (
                                        <div key={task.id} className="task-item">
                                            <span>{task.title}</span>
                                            <select
                                                value={task.assigned_to || ""}
                                                onChange={(e) => handleTeamMemberSelect(task.id, e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Assign to...</option>
                                                {teamMembers.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.first_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                            </div>
                            <div className="new-task-form">
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="tooltip">Add New Task</Tooltip>}
                                >
                                    <Button variant="primary" style={{ marginTop: "40px", alighnItems: "center" }} onClick={() => setShowForm(!showForm)}>
                                        {showForm ? "Hide Form" : "New Task?"}
                                    </Button>
                                </OverlayTrigger>
                                {showForm && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Title:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={newTaskData.title}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Start Date (MM/DD/YYYY):</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="start_date"
                                                value={newTaskData.start_date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">End Date (MM/DD/YYYY):</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="end_date"
                                                value={newTaskData.end_date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Start Time (HH/MM):</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name="start_time"
                                                value={newTaskData.start_time}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">End Time (HH/MM):</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name="end_time"
                                                value={newTaskData.end_time}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {/* <div className="mb-3">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="location"
                                                value={newTaskData.location}
                                                onChange={handleChange}
                                            />
                                        </div> */}
                                        <div className="mb-3">
                                            <label className="form-label">Amount</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="amount"
                                                value={newTaskData.amount}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* <div className="mb-3">
                                            <label className="form-label">Description:</label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                value={newTaskData.description}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div> */}
                                        <Button variant="primary" type="submit" onSubmit={handleSubmit}>
                                            Add Task
                                        </Button>
                                    </form>
                                )}
                                <div>
            <div>
                <div>
                    <Button variant="link" onClick={handleAddResource} className="mr-3">Resources</Button>
                    <Button variant="link" onClick={handleAddExpense} className="mr-3">Expenses</Button>
                    <Button variant="link" onClick={handleSetBudget} className="mr-3">Budget</Button>
                </div>
            </div>

            <Modal show={showResourceForm} onHide={() => setShowResourceForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Resource</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ResourceForm activeToken= {activeToken} onSubmit={() => setShowResourceForm(false)} />
                </Modal.Body>
            </Modal>

            <Modal show={showExpenseForm} onHide={() => setShowExpenseForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ExpenseForm onSubmit={() => setShowExpenseForm(false)} />
                </Modal.Body>
            </Modal>

            <Modal show={showBudgetForm} onHide={() => setShowBudgetForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Set Budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BudgetForm onSubmit={() => setShowBudgetForm(false)} />
                </Modal.Body>
            </Modal>
        </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <p>Need to Login...</p>
            )}
        </>
    );
}

export default EventCard1;