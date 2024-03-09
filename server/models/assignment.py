from database import db
from sqlalchemy_serializer import SerializerMixin

class Assignment(db.Model, SerializerMixin):

    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_user_id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id', name='fk_task_id'), nullable=False)

    def __repr__(self):
        return f'<Team {self.id}>'