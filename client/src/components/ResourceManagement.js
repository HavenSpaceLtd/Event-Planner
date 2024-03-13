import React, { useState, useEffect } from 'react';

function ResourceManagement() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/assets');
      const data = await response.json();
      if (Array.isArray(data)) {
        setResources(data);
      } else {
        console.error('Error fetching resources: Data is not an array');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  return (
    <div>
      <h2>Resource Management</h2>
      <ul>
        {resources.map(resource => (
          <li key={resource.id}>{resource.name} - {resource.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default ResourceManagement;