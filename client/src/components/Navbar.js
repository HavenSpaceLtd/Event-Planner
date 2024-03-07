import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#3e2723' }}>
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/" style={{ color: '#fff' }}>Haven Space Ltd</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav me-auto">
                      
                  <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/register" style={{ color: '#fff' }}>Register</NavLink>
                      </li>

                      <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/login" style={{ color: '#fff' }}>Login</NavLink>
                      </li>
                      
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/" style={{ color: '#fff' }}>Home</NavLink>
            </li>
        
          </ul>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-light" type="submit">Search</button>
          </form>
          <span className="navbar-text mx-3" style={{ color: '#fff' }}>Maureen Wanjiku</span>
          <button className="btn btn-outline-light" style={{ color: '#fff' }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
