from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import db
from models.user import User
from models.event1 import Event 
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Collaboration(db.Model, SerializerMixin):
    __tablename__ = 'collaborations'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, ForeignKey('events.id'))
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    datetime = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship('User', foreign_keys=[user_id])
    event = db.relationship('Event', foreign_keys=[event_id])  # Define the relationship with the Event model

    def __repr__(self):
        return f'<Collaboration {self.id}, {self.user_id}, {self.event_id}, {self.datetime}>'

    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'event': self.event.to_dict() if self.event else None,  # Assuming to_dict method exists in Event class
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
            'datetime': self.datetime.isoformat()
        }
