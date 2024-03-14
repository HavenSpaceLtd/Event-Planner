import React from 'react';

function EventCardDetailed({ title, startDate, endDate, startTime, endTime, location, description, image, amount, progress }) {
  return (
    <div className="card" style={{ width: '18rem' }}>
      {image && <img src={image} className="card-img-top" alt={title} />}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">Start Date: {startDate}</p>
        <p className="card-text">End Date: {endDate}</p>
        <p className="card-text">Start Time: {startTime}</p>
        <p className="card-text">End Time: {endTime}</p>
        <p className="card-text">Location: {location}</p>
        <p className="card-text">Description: {description}</p>
        <p className="card-text">Amount: {amount}</p>
        <p className="card-text">Progress: {progress}</p>
      </div>
    </div>
  );
}

export default EventCardDetailed;
