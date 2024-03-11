from sqlalchemy import Column, Integer, ForeignKey, Float, String
from database import db
from models.event import Event
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Expense(db.Model, SerializerMixin):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    category = db.Column(db.String)
    description = db.Column(db.String)
    event_id = db.Column(db.Integer, ForeignKey('events.id'))

    event = db.relationship('Event', back_populates='expenses')

    def __repr__(self):
        return f'<Expense {self.id}, Event: {self.event_id}, Amount: {self.amount}, Category: {self.category}, Description: {self.description}>'

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'category': self.category,
            'description': self.description,
            'event_id': self.event_id
        }