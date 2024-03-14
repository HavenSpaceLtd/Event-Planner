import React from "react";
import './Dashboard.css'
import Sidebar from "./Sidebar";
import Navbar1 from "./Navbar1";
import Homepage from "./Homepage";
import EventCard from "./EventCard";
import EventCard1 from "./EventCard1";

function Dashboard () {
    return (
        <div className="grid-container">
            <Navbar1/>
            <Sidebar/>
            <Homepage/>
            <EventCard/>
        </div>
    )
}
export default Dashboard;