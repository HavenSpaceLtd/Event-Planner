import React, { useState, useEffect, useContext } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState([]); // Initial user state is null
  const [users, setUsers] = useState([]);
  const [combinedData, setCombinedData] = useState(null);

  const login = (data) => {
    // Set the logged-in user data
    console.log(data)
    setUser(data);
    // Store user data in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(data));
  };
console.log(user)
  const logout = () => {
    // Clear the user data on logout
    setUser(null);
    // Remove user data from sessionStorage
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };
    useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/combined-data'); // Fetch combined data
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse response data as JSON
        console.log(data)
        setCombinedData(data); // Store combined data in state
      } catch (error) {
        console.error('Error fetching combined data:', error);
      }
    }
    
    fetchData(); // Call fetchData function when component mounts
  }, []); // Empty dependency array ensures useEffect runs only once


  useEffect(() => {
    async function fetchUsers() {
        try {
            const response = await fetch('/allusers');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data.users)
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    fetchUsers();
}, []); 

  return (
    <AuthContext.Provider value={{ user, login, users, logout, setUser, combinedData, setCombinedData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);