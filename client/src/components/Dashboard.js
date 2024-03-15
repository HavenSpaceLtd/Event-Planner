import React from "react";
import './Dashboard.css'
import Sidebar from "./Sidebar";
import Navbar1 from "./Navbar1";
import Homepage from "./Homepage";
import EventCard1 from "./EventCard1";

function Dashboard () {
    return (
        <div className="grid-container">
            <Sidebar/>
            <Homepage/>
            <EventCard1/>
        </div>
    )
}
export default Dashboard;