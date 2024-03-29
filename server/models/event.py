from database import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import DateTime, func
from datetime import datetime
from models.task import Task
from models.assignment import Assignment



class Event(db.Model, SerializerMixin):
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
    priority = db.Column(db.String)



    # Foreign key to indicate the owner of the event
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_owner_id'))
    owner = db.relationship('User', foreign_keys=[owner_id], back_populates='events')


    # # Relationship with users who are team members of the event
    # user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_user_id'))
    users = db.relationship('User', secondary = 'user_event_association', back_populates='events')

    tasks = db.relationship('Task', secondary = 'event_task_association', back_populates='events')
    teams = db.relationship('Team', backref='event', lazy=True)

    budgets = db.relationship('Budget', back_populates='event')
    expenses = db.relationship('Expense', back_populates='event')
    assets = db.relationship('Asset', back_populates='event')

    def get_team_members(self):
        team_members = [team.user.to_dict() for team in self.teams]
        return team_members
    
    def get_tasks(self):
        event_tasks = Task.query.filter_by(event_id=self.id).all()
        serialized_tasks = [task.to_dict() for task in event_tasks]
        total_tasks_amount = sum(task.amount for task in event_tasks)
        return serialized_tasks, total_tasks_amount
    
    def get_unassigned_tasks(self):
        unassigned_tasks = Task.query \
            .filter(Task.event_id == self.id) \
            .filter(~Task.id.in_(
                db.session.query(Assignment.task_id)
                .filter(Assignment.task_id == Task.id)
            )) \
            .all()
        return [task.to_dict() for task in unassigned_tasks]
    
    def get_assigned_tasks_with_users(self):
        from models.user import User  # Import User model locally

        assigned_tasks = db.session.query(Task, User.email) \
            .join(Assignment, Task.id == Assignment.task_id) \
            .join(User, Assignment.user_id == User.id) \
            .filter(Task.event_id == self.id) \
            .all()
        
        assigned_tasks_with_users = [
            {
                'task': task.to_dict(),
                'user': email
            }
            for task, email in assigned_tasks
        ]
        
        return assigned_tasks_with_users

    def get_tasks_average_progress(self):
        total_progress = db.session.query(func.sum(Task.progress)) \
                                    .filter(Task.event_id == self.id) \
                                    .scalar()

        num_tasks = db.session.query(Task) \
                             .filter(Task.event_id == self.id) \
                             .count()

        if num_tasks == 0:
            return 0  # Return 0 if there are no tasks

        return total_progress / num_tasks

    def __repr__(self) -> str:
        return f'<Event {self.id}, {self.title}, {self.start_date}, {self.start_time}, {self.end_date}, {self.end_time}, {self.created_at}, {self.updated_at}, {self.image}, {self.description}, {self.location}, {self.amount}, {self.progress}, {self.priority}>'

    def to_dict(self):
        tasks, total_tasks_amount = self.get_tasks()
        return {
            'id': self.id,
            'title': self.title,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'location': self.location,
            'amount': self.amount,
            'description': self.description,
            'priority': self.priority,
            'image': self.image,
            'team_members': self.get_team_members(), 
            'tasks': tasks,
            'unassigned_tasks': self.get_unassigned_tasks(),
            'assigned_tasks': self.get_assigned_tasks_with_users(),
            'average_progress': self.get_tasks_average_progress(),
            'total_tasks_amount': total_tasks_amount
        }