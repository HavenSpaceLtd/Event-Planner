# clear_tables.py

from app import app, db  # Import your Flask app instance and SQLAlchemy instance
from models.task1 import Task # Import your Task and Event models
from models.event1 import Event

def clear_tables():
    with app.app_context():
        # Clear records from the Task table
        db.session.query(Task).delete()
        
        # Clear records from the Event table
        db.session.query(Event).delete()
        
        # Commit the changes
        db.session.commit()

if __name__ == '__main__':
    clear_tables()
