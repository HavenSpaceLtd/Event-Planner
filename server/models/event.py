from database import db
from sqlalchemy import DateTime, func


class Event(db.Model):
    __tablename__ = 'events'

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

    location = db.Column(db.String)
    description = db.Column(db.String)
    image = db.Column(db.String)


    # Foreign key to indicate the owner of the event
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_owner_id'))
    owner = db.relationship('User', foreign_keys=[owner_id], back_populates='events')


    # Relationship with users who are team members of the event
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_user_id'))
    users = db.relationship('User', secondary = 'user_event_association', back_populates='events')

    tasks = db.relationship('Task', secondary = 'event_task_association', back_populates='events')

    def __repr__(self) -> str:
        return f'<Event {self.id}, {self.title}, {self.start_date}, {self.start_time}, {self.end_date}, {self.end_time}, {self.created_at}, {self.updated_at}, {self.image} ,{self.description}, {self.location}, {self.amount}, {self.progress}>'