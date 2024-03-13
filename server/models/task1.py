from database import db
from sqlalchemy import DateTime, func
from datetime import datetime


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    taskTitle = db.Column(db.String)
    start_date = db.Column(db.Date)  # Updated attribute name
    end_date = db.Column(db.Date)
    priority = db.Column(db.String)
    status = db.Column(db.String)
    assignedTo = db.Column(db.JSON)
    numParticipants = db.Column(db.String)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now())
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    events = db.relationship('Event', secondary='event_task_association', back_populates='tasks')

    def __repr__(self) -> str:
        return f'<Task {self.id}, {self.taskTitle}, {self.start_date}, {self.end_date}, {self.created_at}, {self.updated_at}>'

    def to_dict(self):
        return {
            'id': self.id,
            'taskTitle': self.taskTitle,
            'start_date': self.start_date,  # Updated attribute name
            'end_date': self.end_date,
            'priority': self.priority,
            'assignedTo': self.assignedTo,
            'status': self.status,
            'numParticipants': self.numParticipants,
            'event_id': self.event_id
        }


