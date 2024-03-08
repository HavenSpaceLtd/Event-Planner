from sqlalchemy import Column, Integer, ForeignKey, Float
from database import db
from models.event import Event
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Budget(db.Model, SerializerMixin):
    __tablename__ = 'budgets'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, ForeignKey('events.id'))
    amount = db.Column(db.Float)

    event = db.relationship('Event', back_populates='budgets')

    def __repr__(self):
        return f'<Budget {self.id}, Event: {self.event_id}, Amount: {self.amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'amount': self.amount
        }
