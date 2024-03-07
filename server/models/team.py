from database import db
from sqlalchemy_serializer import SerializerMixin

class Team(db.Model, SerializerMixin):

    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

    def __repr__(self):
        return f'<Team {self.id}>'