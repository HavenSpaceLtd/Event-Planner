from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import db
from models.user import User
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Communication(db.Model, SerializerMixin):
    __tablename__ = 'communications'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String)
    recipient_id = db.Column(db.Integer, ForeignKey('users.id'))
    datetime = db.Column(db.DateTime, default=datetime.now)

    recipient = db.relationship('User', foreign_keys=[recipient_id])

    def __repr__(self):
        return f'<Collaboration {self.id}, {self.message}, {self.recipient_id}, {self.datetime}>'

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'recipient_id': self.recipient_id,
            'recipient': self.recipient.to_dict(),
            'datetime': self.datetime.isoformat()  # Using ISO format for datetime
        }