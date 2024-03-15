import React from 'react';
import { BsCart3, BsFillArchiveFill, BsFillGearFill, BsGrid1X2Fill, BsListCheck, BsMenuButtonWideFill, BsPeopleFill, BsCalendar, BsCheckCircle } from "react-icons/bs";
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <aside id='sidebar'>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <BsCart3 className='icon_header' /> EventPlannerApp
                </div>
            </div>
            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to='/Dashboard'>
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to='/allevents'>
                        <BsFillArchiveFill className='icon' /> All Events
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to='/manageeventmanager'>
                        <BsPeopleFill className='icon' /> Manage Event Manager
                    </Link>
                    <ul className='subfields'>
                        <li>
                            <Link to='/myevents'>
                                <BsCalendar className='sub-icon' /> My Events
                            </Link>
                        </li>
                        <li>
                            <Link to='/mytasks'>
                                <BsCheckCircle className='sub-icon' /> My Tasks
                            </Link>
                            <ul className='subfields'>
                                <li>
                                    <Link to='/important'>
                                        <BsCalendar className='sub-icon' /> Important
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/highpriority'>
                                        <BsCheckCircle className='sub-icon' /> High Priority
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className='sidebar-list-item'>
                    <Link to='/reports'>
                        <BsMenuButtonWideFill className='icon' /> Reports
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to='/settings'>
                        <BsFillGearFill className='icon' /> Settings
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to='/logout'>
                        <BsListCheck className='icon' /> Logout
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar;
