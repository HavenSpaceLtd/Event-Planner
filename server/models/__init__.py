from database import db

# association tables
user_task_association = db.Table(
    'user_task_association',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'))
)

event_task_association = db.Table(
    'event_task_association',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id')),
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'))
)