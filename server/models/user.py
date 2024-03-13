from database import db
from sqlalchemy_serializer import SerializerMixin
from models.event1 import Event
from models.task1 import Task
from models.assignment import Assignment
from datetime import datetime, timedelta

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    phone = db.Column(db.String)
    email = db.Column(db.String)
    location = db.Column(db.String)
    title = db.Column(db.String)
    password = db.Column(db.String)
    about = db.Column(db.String)
    image = db.Column(db.String)

    events = db.relationship('Event', secondary = 'user_event_association', back_populates='users')
    teams = db.relationship('Team', backref='user', lazy=True)

    def __repr__(self) -> str:
        return f'<User {self.id}, {self.first_name}, {self.last_name}, {self.phone}, {self.email}, {self.location}, {self.title}, {self.image} ,{self.about}, {self.password}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'title': self.title,
            'location': self.location,
            'email': self.email,
            'about': self.about,
            'image': self.image,    
        }
    
    def get_owned_events(self):
        owned_events = Event.query.filter_by(owner_id=self.id).all()
        serialized_events = [event.to_dict() for event in owned_events]
        return serialized_events
    
    def get_assigned_tasks(self):
        assigned_tasks = db.session.query(Task) \
            .join(Assignment, Task.id == Assignment.task_id) \
            .filter(Assignment.user_id == self.id) \
            .all()
        
        return [task.to_dict() for task in assigned_tasks]
    
    def get_assigned_tasks_due_within_week(self):
        # Calculate the date one week from now
        one_week_from_now = datetime.now() + timedelta(days=7)

        # Query tasks assigned to the user that are due within one week
        assigned_tasks_due_within_week = db.session.query(Task) \
            .join(Assignment, Task.id == Assignment.task_id) \
            .filter(Assignment.user_id == self.id) \
            .filter(Task.end_date <= one_week_from_now) \
            .all()
        
        return [task.to_dict() for task in assigned_tasks_due_within_week]