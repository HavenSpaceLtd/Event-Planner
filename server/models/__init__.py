from database import db
from .budget import Budget
from .collaboration import Collaboration
from .expense import Expense
from .asset import Asset
from .communication import Communication

# Association table for the many-to-many relationship between Worker and OfferedJob

user_event = db.Table(
    'user_event_association',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'))
)

event_task = db.Table(
    'event_task_association',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id')),
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'))
)