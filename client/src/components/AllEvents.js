import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCardSummarized from './EventCardSummarized';
import EventCardDetailed from './EventCardDetailed';

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="container">
      <h1 className="mt-5">Upcoming Events</h1>
      <div className="row mt-3">
        {events.map(event => (
          <div className="col-md-4 mb-4" key={event.id}>
            <EventCardSummarized
              title={event.title}
              startDate={event.start_date}
              endDate={event.end_date}
              image={event.image}
              onClick={() => handleEventClick(event)}
            />
          </div>
        ))}
      </div>
      {selectedEvent && (
        <EventCardDetailed
          title={selectedEvent.title}
          startDate={selectedEvent.start_date}
          endDate={selectedEvent.end_date}
          startTime={selectedEvent.start_time}
          endTime={selectedEvent.end_time}
          location={selectedEvent.location}
          description={selectedEvent.description}
          image={selectedEvent.image}
          amount={selectedEvent.amount}
          progress={selectedEvent.progress}
        />
      )}
    </div>
  );
}

export default AllEvents;