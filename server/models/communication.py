from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey
from database import db
from models.user import User
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Communication(db.Model, SerializerMixin):
    __tablename__ = 'communications'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String)
    sender_id = db.Column(db.Integer, ForeignKey('users.id', name='fk_sender_id'))
    recipient_id = db.Column(db.Integer, ForeignKey('users.id', name='fk_recipient_id'))
    datetime = db.Column(db.String)  # Change to db.String

    sender = db.relationship('User', foreign_keys=[sender_id])
    recipient = db.relationship('User', foreign_keys=[recipient_id])

    def __repr__(self):
        return f'<Communication {self.id}, {self.message}, {self.sender_id}, {self.recipient_id}, {self.datetime}>'

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'sender_id': self.sender_id,
            'sender': self.sender.to_dict(),
            'recipient_id': self.recipient_id,
            'recipient': self.recipient.to_dict(),
            'datetime': self.datetime  # No need to convert to ISO format, assuming it's already formatted
        }