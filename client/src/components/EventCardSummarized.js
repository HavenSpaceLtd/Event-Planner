import React from 'react';

function EventCardSummarized({ title, startDate, endDate, image, onClick }) {
  return (
    <div className="card" style={{ width: '18rem', cursor: 'pointer' }} onClick={onClick}>
      {image && <img src={image} className="card-img-top" alt={title} />}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">Start Date: {startDate}</p>
        <p className="card-text">End Date: {endDate}</p>
      </div>
    </div>
  );
}

export default EventCardSummarized;
