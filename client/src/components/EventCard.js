import React, { useState, useEffect } from "react";

function EventCard() {
    const [userData, setUserData] = useState(null);

    const activeUser = sessionStorage.getItem('userId');
    const activeToken = sessionStorage.getItem('accessToken');


    useEffect(() => {
        async function fetchUserData() {
            try {
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
    }, []); 

    return (
        <>
            {userData ? (
                <div>
                    <p>Name: {userData.first_name} {userData.last_name}</p>
                    <p>Email: {userData.email}</p>
                    {/* <p>Events: {userData.events}</p>
                    <p>Tasks: {userData.tasks}</p> */}
                    {/* Display other user data as needed */}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </>
    );
}

export default EventCard;
