import React, { useState } from 'react';

export default function ResourceForm({ activeToken }) {
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        start_date: '',
        end_date: '',
        availability_status: '',
        event_id: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/assets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}`
                },
                body: JSON.stringify({
                    ...formData,
                    start_date: formatDate(formData.start_date),
                    end_date: formatDate(formData.end_date)
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.Message);
            } else {
                setMessage('Failed to add resource.');
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage('Network error occurred.');
        }
    };

    // Function to format date from YYYY-MM-DD to MM/DD/YYYY
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
    };

    return (
        <div>
            {message && <p>{message}</p>}
          

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2>Add New Asset</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Quantity:</label>
                    <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Availability Status:</label>
                    <input
                        type="text"
                        name="availability_status"
                        value={formData.availability_status}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Event ID:</label>
                    <input
                        type="text"
                        name="event_id"
                        value={formData.event_id}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>Submit</button>
            </form>
        </div>
    );
}