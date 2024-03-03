from flask import Flask
from flask_migrate import Migrate
from database import db
from models.user import User
from models.event import Event
from models.task import Task


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Create Migrations
migrate = Migrate(app, db)

db.init_app(app)

if __name__ == '__main__':
    app.run(port=5555)