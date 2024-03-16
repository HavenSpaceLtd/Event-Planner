from database import db
from sqlalchemy import DateTime, func
from datetime import datetime


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    start_time=db.Column(db.Time)
    end_time=db.Column(db.Time)

    amount = db.Column(db.Integer)
    progress = db.Column(db.Integer)

    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now())
    status = db.Column(db.String)
    location = db.Column(db.String)
    description = db.Column(db.String)
    image = db.Column(db.String)

    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))

    events = db.relationship('Event', secondary = 'event_task_association', back_populates='tasks')



    def __repr__(self) -> str:
        return f'<Event {self.id}, {self.title}, {self.start_date}, {self.start_time}, {self.end_date}, {self.end_time}, {self.created_at}, {self.updated_at}, {self.image} ,{self.description}, {self.location}, {self.status}, {self.amount}, {self.progress}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'location': self.location,
            'status': self.status,
            'amount': self.amount,
            'description': self.description,
            'image': self.image,
            'progress': self.progress,
            
        }