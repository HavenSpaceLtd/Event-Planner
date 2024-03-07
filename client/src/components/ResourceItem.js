import React from 'react';

const ResourceItem = ({ resource, onDelete }) => {
  return (
    <div>
      <h3>{resource.name}</h3>
      <p>Quantity: {resource.quantity}</p>
      <p>Availability: {resource.availability ? 'Available' : 'Not Available'}</p>
      <button onClick={() => onDelete(resource.id)}>Delete</button>
    </div>
  );
};

export default ResourceItem;