import React, { useState, useEffect } from "react";

function EventCard1() {
    const [userData, setUserData] = useState(null);

    const activeUser = sessionStorage.getItem('userId');
    const activeToken = sessionStorage.getItem('accessToken');

    useEffect(() => {
        async function fetchUserData() {
            try {
                // Fetch user data including events and tasks
                const response = await fetch(`/users/${activeUser}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${activeToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await response.json();
                setUserData(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, [activeUser, activeToken]); // Make sure to include activeUser and activeToken as dependencies

    return (
        <>
            {userData ? (
                <div>
                    <p>Name: {userData.first_name} {userData.last_name}</p>
                    <p>Email: {userData.email}</p>
                    <h2>Events:</h2>
                    {userData.events.map(event => (
                        <div key={event.id}>
                            <p>Title: {event.title}</p>
                            <p>Start Date: {event.start_date}</p>
                            <p>End Date: {event.end_date}</p>
                            {/* Add other event details as needed */}
                        </div>
                    ))}
                    <h2>Tasks:</h2>
                    {userData.tasks.map(task => (
                        <div key={task.id}>
                            <p>Title: {task.title}</p>
                            <p>Description: {task.description}</p>
                            {/* Add other task details as needed */}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </>
    );
}

export default EventCard1;
