import React from 'react';

function Login() {
  return (
    <div className="container-fluid" style={{ height: '90vh', backgroundColor: 'bisque', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '50%', textAlign: 'center' }}>
        <h1>Login</h1>
        <form>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Name" style={{ backgroundColor: 'white', border: '1px solid black', marginBottom: '10px' }} />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" style={{ backgroundColor: 'white', border: '1px solid black', marginBottom: '10px' }} />
          </div>
       
          <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#3e2723' }}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
