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
                    <a href=''>
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href=''>
                        <BsFillArchiveFill className='icon' /> All Events
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href='/Table'>
                        <BsPeopleFill className='icon' /> Manage Event Manager
                    </a>
                    <ul className='subfields'>
                        <li>
                            <a href=''>
                                <BsCalendar className='sub-icon' /> My Events
                            </a>
                        </li>
                        <li>
                            <a href=''>
                                <BsCheckCircle className='sub-icon' /> My Tasks
                            </a>
                            <ul className='subfields'>
                                <li>
                                    <a href=''>
                                        <BsCalendar className='sub-icon' /> Important
                                    </a>
                                </li>
                                <li>
                                    <a href=''>
                                        <BsCheckCircle className='sub-icon' /> High Priority
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className='sidebar-list-item'>
                    <a href=''>
                        <BsMenuButtonWideFill className='icon' /> Reports
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href=''>
                        <BsFillGearFill className='icon' /> Setting
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href=''>
                        <BsListCheck className='icon' /> Logout
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar;