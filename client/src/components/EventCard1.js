import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./EventCard1.css";

function EventCard1({ id, title, location, startDate, endDate, ownerId, userData, activeToken }) {
    const [showPopup, setShowPopup] = useState(false);
    const [eventData, setEventData] = useState({});
    const [newTaskData, setNewTaskData] = useState({
        title: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        location: "",
        amount: "",
        description: ""
    });
    const [selectedTeamMember, setSelectedTeamMember] = useState("");
    const [counter, setCounter] = useState(0);
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
                throw new Error("Failed to fetch user data");
            }
            const eventData = await response.json();
            setEventData(eventData);
        } catch (error) {
            console.error("Error fetching event data:", error);
        }
    };

    useEffect(() => {
        async function fetchEventData() {
            try {
                const response = await fetch(`/events/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${activeToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const eventData = await response.json();
                setEventData(eventData);
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        }
        fetchEventData();
    }, [counter]);

    const togglePopup = () => {
        setShowPopup(!showPopup);
        console.log(id);
        console.log(eventData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTaskData({ ...newTaskData, [name]: value });
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
            // Refresh event data after adding new task
            fetchEventData();

            // Close the popup after adding new task
            setShowPopup(false);
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
            // Refresh data after assignment
            setCounter(prevCounter => prevCounter + 1);
            fetchEventData();
        } catch (error) {
            console.error("Error assigning task to user:", error);
        }
    };


    const handleTeamMemberSelect = (taskId, userId) => {
        handleAssignTask(userId, taskId);
    };

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ width: "250px" }}>
                <div className="card-body" onClick={togglePopup}>
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <p className="card-text">Location: {location}</p>
                    <p className="card-text">Start Date:  {startDate}</p>
                </div>
            </div>
            {showPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <button className="close-btn" onClick={togglePopup}>X</button>
                        <h2>{title}</h2>
                        {/* <p>ID: {id}</p> */}
                        <p>Location: {location}</p>
                        <p>Start Date: {startDate}</p>
                        <p>End Date: {endDate}</p>

                        <ul>
                            <h4>Unassigned Tasks:</h4>
                            {eventData.unassigned_tasks.map((task) => (
                                <div key={task.id}>
                                    <span>{task.title}</span>
                                    <select
                                        value={task.assigned_to || ''} // Set the initial value based on whether the task is assigned
                                        onChange={(e) => handleTeamMemberSelect(task.id, e.target.value)}
                                    >
                                        <option value="">Assign to...</option>
                                        {eventData.team_members.map((member) => (
                                            <option key={member.id} value={member.id}>{member.first_name}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </ul>
                        <ul><h4>Assigned Tasks:</h4>
                            {eventData.assigned_tasks.map((item) => {
                                return <li key={item.task.id}>{item.task.title}</li>
                            }
                            )}
                        </ul>
                        <ul><h4>Team Members:</h4>
                            {eventData.team_members.map((item) => {
                                return <li>{item.first_name}</li>
                            }
                            )}
                        </ul>
                        <div style={{ width: "250px" }}>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Title:
                                    <input type="text" name="title" value={newTaskData.title} onChange={handleChange} />
                                </label>
                                <label>
                                    Start Date (MM/DD/YYYY):
                                    <input type="text" name="start_date" value={newTaskData.start_date} onChange={handleChange} />
                                </label>
                                <label>
                                    Start Time (HH:MM):
                                    <input type="text" name="start_time" value={newTaskData.start_time} onChange={handleChange} />
                                </label>
                                <label>
                                    End Date (MM/DD/YYYY):
                                    <input type="text" name="end_date" value={newTaskData.end_date} onChange={handleChange} />
                                </label>
                                <label>
                                    End Time (HH:MM):
                                    <input type="text" name="end_time" value={newTaskData.end_time} onChange={handleChange} />
                                </label>
                                <button type="submit">Add Task</button>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default EventCard1;
