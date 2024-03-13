from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from database import db
from models.event1 import Event
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Asset(db.Model, SerializerMixin):
    __tablename__ = 'assets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    quantity = db.Column(db.Integer)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, default=datetime.utcnow)
    availability_status = db.Column(db.String, default=True)
    event_id = db.Column(db.Integer, ForeignKey('events.id'))

    event = db.relationship('Event', back_populates='assets')

    def __repr__(self):
        return f'<Asset {self.id}, Name: {self.name}, Quantity: {self.quantity}, Event: {self.event_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'start_date': self.start_date.strftime('%Y-%m-%d %H:%M:%S'),
            'end_date': self.end_date.strftime('%Y-%m-%d %H:%M:%S'),
            'availability_status': self.availability_status,
            'event_id': self.event_id
        }