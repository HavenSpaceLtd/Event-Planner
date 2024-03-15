import React, { useState, useEffect } from "react";
import NewEventForm from "./NewEventForm"

function Home() {
    const [selectedItem, setSelectedItem] = useState('');
    const [userData, setUserData] = useState({});
    const [counter, setCounter] = useState(0);


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

    const handleItemClick = (item) => {
        setSelectedItem(item);
        // console.log(selectedUser);
        setCounter(prevCounter => prevCounter + 1);
        console.log(userData);
        if (item == "Logout") {
            sessionStorage.removeItem('selectedUser');
        }
    };

    let trimmedPath = userData.image ? userData.image.replace("../client/public", "") : "";
    let plain = "/images/default.jpg"

    return (
        <>
            {userData.title == "planner" ? (
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
            {userData.title == "user" ? (
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
                                    {/* {data.approved_jobs.map((item) => {
                                        return <ApprovedJobCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.amount}
                                            hours={item.hours}
                                            progress={item.progress}
                                            title={item.title}
                                            userId={activeUser.id}

                                        />
                                    })} */}
                                </div>
                            )}
                            {selectedItem === 'My Tasks' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {/* {data.new_jobs.map((item) => {
                                        return <NewJobCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.wage}
                                            hours={item.hours}
                                            title={item.title}
                                            userId={activeUser.id}
                                            update={setCounter}
                                        />
                                    })} */}
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
                                    {/* {data.active_bids.map((item) => {
                                        return <UnapprovedBidCard
                                            key={item.id}
                                            id={item.id}
                                            offered_amount={item.offered_job_wage}
                                            hours={item.offered_job_hours}
                                            title={item.offered_job_title}
                                            bid_amount={item.amount}
                                            update={setCounter}
                                        />
                                    })} */}
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
                                    {/* <ProfileCard userData={data} onUpdate={handleUpdateProfile} /> */}
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
