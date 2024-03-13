from database import db
from sqlalchemy import DateTime, func
from datetime import datetime
from models.task1 import Task


class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)

    eventTitle = db.Column(db.String)
    startDate = db.Column(db.Date)
    endDate = db.Column(db.Date)
    



    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now())



    # Foreign key to indicate the owner of the event
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_owner_id'))
    owner = db.relationship('User', foreign_keys=[owner_id], back_populates='events')


    # # Relationship with users who are team members of the event
    # user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_user_id'))
    users = db.relationship('User', secondary = 'user_event_association', back_populates='events')
    budgets = db.relationship('Budget', back_populates='event')
    expenses = db.relationship('Expense', back_populates='event')
    assets = db.relationship('Asset', back_populates='event')


    tasks = db.relationship('Task', secondary = 'event_task_association', back_populates='events')
    teams = db.relationship('Team', backref='event', lazy=True)

    def get_team_members(self):
        team_members = [team.user.to_dict() for team in self.teams]
        return team_members
    
    def get_tasks(self):
        
        event_tasks = Task.query.filter_by(event_id=self.id).all()
        serialized_tasks = [task.to_dict() for task in event_tasks]
        return serialized_tasks
        

    def __repr__(self) -> str:
        return f'<Event {self.id}, {self.eventTitle}, {self.startDate}, {self.endDate}, {self.created_at}, {self.updated_at}>'

    def to_dict(self):
        return {
            'id': self.id,
            'eventTitle': self.eventTitle,
            'startDate': self.startDate,
            'endDate': self.endDate,
        
        }
    