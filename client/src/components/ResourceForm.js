import React, { useState } from 'react';

const ResourceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    startDate: '',
    endDate: '',
    availability: true
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Retrieve JWT token from session storage
    const token = sessionStorage.getItem('accessToken');

    // Submit reservation request to the backend with authorization header
    try {
      const response = await fetch('/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include JWT token in Authorization header
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit reservation');
      }
      
      // Reset form after successful submission
      setFormData({
        name: '',
        quantity: '',
        startDate: '',
        endDate: '',
        availability: true
      });
      
      // Handle success or navigate to another page
      // Example: onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting reservation:', error);
      // Handle error
      // Example: setError('Failed to submit reservation');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Resource Name:</label>
        <input type="text" name="name" id="name" style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }} value={formData.name} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="quantity" style={{ display: 'block', marginBottom: '5px' }}>Quantity:</label>
        <input type="number" name="quantity" id="quantity" style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }} value={formData.quantity} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>Start Date:</label>
        <input type="datetime-local" name="startDate" id="startDate" style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }} value={formData.startDate} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px' }}>End Date:</label>
        <input type="datetime-local" name="endDate" id="endDate" style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }} value={formData.endDate} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          Availability:
          <input type="checkbox" name="availability" checked={formData.availability} onChange={() => setFormData({ ...formData, availability: !formData.availability })} />
        </label>
      </div>
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '16px', borderRadius: '4px', cursor: 'pointer' }}>Submit Reservation</button>
    </form>
  );
};

export default ResourceForm;