import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NewEventForm from "./NewEventForm";
import ProfileCard from "./ProfileCard";
import EventCard1 from "./EventCard1";
import MyTaskCard from "./MyTaskCard";

function Home() {
    const [selectedItem, setSelectedItem] = useState('');
    const [userData, setUserData] = useState({});
    const [counter, setCounter] = useState(0);
    const navigate = useNavigate(); // Initialize navigate hook

    

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
    }, [counter]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        // console.log(selectedUser);
        setCounter(prevCounter => prevCounter + 1);
        // console.log(userData);
        if (item == "Logout") {
            sessionStorage.removeItem('selectedUser');
        }
    };

    const handleUpdateProfile = (updatedData) => {
        // // Convert updatedData to FormData
        const formData = new FormData();
        for (const key in updatedData) {
            formData.append(key, updatedData[key]);
        }
    
        // Send updated profile data to the backend
        fetch(`/users/${activeUser}`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${activeToken}`
            },
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
    
            // If update successful, trigger a counter to refresh the data
            console.log(updatedData);
            setCounter(counter + 1);
            alert('Updated successfully!');
        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });
    }


    let trimmedPath = userData.image ? userData.image.replace("../client/public", "") : "";
    let plain = "/images/default.jpg";

    // Check if userId exists, if not, navigate to login
    if (!sessionStorage.getItem('userId')) {
        navigate('/login'); // Redirect to login page
        return null; // Return null to prevent rendering
    }

    return (
        <>

            {userData ? (
                <>

                    <div >
                        <div className="row" >
                            {/* left column */}

                            <div className="ms-5 mt-5 col-4" style={{ "width": "250px", "height": "700px" }}>

                                <h4>{`${userData.first_name} ${userData.last_name}`}, {userData.title}</h4>
                                <div className="mt-2 mb-2 ms-5" id={activeUser.id} ><img className="border border-secondary rounded" id={activeUser.id} src={trimmedPath ? trimmedPath : plain} style={{ height: "100px" }}></img></div>
                                <div className="list-group" style={{ "width": "250px" }}>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'My Events' && 'active'}`}
                                        onClick={() => handleItemClick('My Events')}
                                    >
                                        My Events
                                    </a>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'My Tasks' && 'active'}`}
                                        onClick={() => handleItemClick('My Tasks')}
                                    >
                                        My Tasks
                                    </a>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Create New Event' && 'active'}`}
                                        onClick={() => handleItemClick('Create New Event')}
                                    >
                                        Create New Event
                                    </a>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'High Priority Tasks' && 'active'}`}
                                        onClick={() => handleItemClick('High Priority Tasks')}
                                    >
                                        High Priority Tasks
                                    </a>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Due Tasks' && 'active'}`}
                                        onClick={() => handleItemClick('Due Tasks')}
                                    >
                                        Due Tasks
                                    </a>


                                    {userData.title === 'planner' && (
                                        <a
                                            href="#"
                                            className={`list-group-item list-group-item-action ${selectedItem === 'All Events' && 'active'}`}
                                            onClick={() => handleItemClick('All Events')}
                                        >
                                            All Events
                                        </a>
                                    )}
                                    {userData.title === 'planner' && (
                                        <a
                                            href="#"
                                            className={`list-group-item list-group-item-action ${selectedItem === 'All Tasks' && 'active'}`}
                                            onClick={() => handleItemClick('All Tasks')}
                                        >
                                            All Tasks
                                        </a>
                                    )}
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Your Profile' && 'active'}`}
                                        onClick={() => handleItemClick('Your Profile')}
                                    >
                                        Your Profile
                                    </a>
                                    <a
                                        href="/login"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Logout' && 'active'}`}
                                        onClick={() => handleItemClick('Logout')}
                                    >
                                        Logout
                                    </a>

                                </div>
                            </div>
                            {/* right column */}
                            {selectedItem === 'My Events' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {userData.events.map((item) => {
                                        return <EventCard1
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            location={item.location}
                                            startDate={item.start_date}
                                            endDate={item.end_date}
                                            amount={item.amount}
                                            ownerId={item.owner_id}
                                            userData={userData}
                                            activeToken={activeToken}
                                            currentTeamMembers={item.team_members}

                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'My Tasks' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {userData.tasks.map((item) => {
                                        return <MyTaskCard
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            startDate={item.start_date}
                                            endDate={item.end_date}
                                            update={setCounter}
                                            activeToken={activeToken}
                                            current_progress={item.progress}
                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'Create New Event' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {<NewEventForm />}
                                </div>
                            )}
                            {selectedItem === 'High Priority Tasks' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {/* {data.bids.map((item) => {
                                        return <BidCard
                                            key={item.id}
                                            id={item.id}
                                            offered_amount={item.offered_job_wage}
                                            hours={item.offered_job_hours}
                                            title={item.offered_job_title}
                                            bid_amount={item.amount}
                                        />
                                    })} */}
                                </div>
                            )}
                            {selectedItem === 'Due Tasks' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {userData.due_tasks.map((item) => {
                                        return <MyTaskCard
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            startDate={item.start_date}
                                            endDate={item.end_date}
                                            update={setCounter}
                                            activeToken={activeToken}
                                            current_progress={item.progress}
                                        />
                                    })}
                                </div>
                            )}

                            {selectedItem === 'All Events' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {/* <Table bidData={bidData} update={setCounter} /> */}
                                </div>
                            )}

                            {selectedItem === 'All Tasks' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px", padding: "50px" }}>
                                    {/* <ConcludedTable concludedData={concludedData} update={setCounter} /> */}
                                </div>
                            )}

                            {selectedItem === 'Your Profile' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    <ProfileCard userData={userData} onUpdate={handleUpdateProfile} activeToken={activeToken} />
                                </div>
                            )}

                        </div>


                    </div>
                </>) : (
                <p>Need to Login...</p>
            )}




        </>
    );
}

export default Home;
