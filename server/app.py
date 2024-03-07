from flask import Flask, make_response, request, jsonify, session, flash
from flask_migrate import Migrate
from database import db
from functools import wraps
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import os
from werkzeug.utils import secure_filename
from models.event import Event
from models.user import User
from models.task import Task
from models.team import Team
from datetime import datetime

app = Flask(__name__)

UPLOAD_FOLDER = "../client/public/images/"
app.json.compact = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create Migrations
migrate = Migrate(app, db)

# Create api instance
api = Api(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

db.init_app(app)

ALLOWED_EXTENSIONS = set(['png','jpg','jpeg','gif'])
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def planner_required(fn):
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user.get('title') == "planner":
            return fn(*args, **kwargs)
        else:
            return jsonify(message="Unauthorized"), 403
    return wrapper

class Index(Resource):
    def get(self):
        return "<h1>Skidi Papa Papa</h1>"

class AllUsers(Resource):
    def post(self):
        data = request.form

        # Get form data
        email = data.get('email')

        # Check if user with the given email already exists
        existing_user = User.query.filter(User.email == email).first()
        if existing_user:
            return make_response(jsonify({"Error": f"Email account {email} already exists"}), 409)

        # Handle image upload
        image_file = request.files['image']

        if 'image' not in request.files:
            return make_response(jsonify({"error": "Image not found"}), 404)

        if image_file.filename == '':
            return make_response(jsonify({"error": "No file selected"}), 404)

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)

        # If the email is unique and image is uploaded successfully, proceed with creating the new user
        new_user = User(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            phone=data.get('phone'),
            title=data.get('title'),
            email=data.get('email'),
            about=data.get('about'),
            location=data.get('location'),
            password=bcrypt.generate_password_hash(data.get('password')),
            image=image_path  # Assigning the path of the uploaded image
        )

        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify({"Message": f"New user with email, {new_user.email}, successfully registered."}), 201)

    @jwt_required()
    def get(self):
        users = User.query.all()
        users_list = [
            {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "title": user.title,
            }
            for user in users
        ]
        return make_response(jsonify(users_list))



class UserById(Resource):
    @jwt_required()
    def get(self, id):
        current_user_id = get_jwt_identity()['user_id']
        user = User.query.get(current_user_id)

        if user is None:
            return make_response(jsonify({"error": "User not found!"}), 404)

        user_data = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "title": user.title,
            "phone": user.phone,
            "image": user.image,
            "about": user.about,
            "location": user.location,
        }
        return make_response(jsonify(user_data))

    @jwt_required()
    def patch(self, id):
        current_user_id = get_jwt_identity()['user_id']
        data = request.json

        user = User.query.get(id)

        if user is None:
            return make_response(jsonify({"error": "User not found!"}), 404)

        if user.id != current_user_id:
            return make_response(jsonify({"error": "Unauthorized!"}), 403)

        if 'about' in data:
            user.about = data['about']
        if 'location' in data:
            user.location = data['location']
        if 'phone' in data:
            user.phone = data['phone']

        db.session.commit()

        updated_user_data = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "title": user.title,
            "phone": user.phone,
            "image": user.image,
            "about": user.about,
            "location": user.location,
        }
        return make_response(jsonify(updated_user_data), 200)

    @jwt_required()
    def post(self, id):
        current_user_id = get_jwt_identity()['user_id']
        data = request.json

        # Handle image upload
        user = User.query.get(id)
        image_file = request.files['image']

        if 'image' not in request.files:
            flash('No file...')
            return make_response(jsonify({"error": "Image not found"}), 404)

        if user.id != current_user_id:
            return make_response(jsonify({"error": "Unauthorized!"}), 403)

        if image_file.filename == '':
            flash('No image selected')
            return make_response(jsonify({"error": "No file selected"}), 404)

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            user.image = image_path

            updated_user = {"image": user.image}

            db.session.commit()

        return make_response(jsonify(updated_user), 200)


class LoginUser(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter(User.email == email).first()

        if user is None:
            return make_response(jsonify({"Error": "No such user!"}), 401)
        if not bcrypt.check_password_hash(user.password, password):
            return make_response(jsonify({"Error": "Incorrect password!"}), 401)

        # Create JWT Token
        access_token = create_access_token(identity={'user_id': user.id})

        return make_response(jsonify({
            "Message": "Login successful!",
            "access_token": access_token,
            "name": f"{user.first_name} {user.last_name}",
            "id": f"{user.id}",
            "email": user.email,
            "title": user.title,
            "image": user.image,
            "events": user.get_owned_events()
        }), 200)

    def delete(self):
        session.pop("user_id", None)
        return make_response(jsonify({"Message": "Logout successful!"}), 200)
    

class AllEvents(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        
        # Convert start date string to Python date object
        start_date_str = data.get('start_date')
        start_date = datetime.strptime(start_date_str, '%m/%d/%Y').date()
        
        # Convert end date string to Python date object
        end_date_str = data.get('end_date')
        end_date = datetime.strptime(end_date_str, '%m/%d/%Y').date()
        
        # Convert start time string to Python time object
        start_time_str = data.get('start_time')
        start_time = datetime.strptime(start_time_str, '%H:%M').time()
        
        # Convert end time string to Python time object
        end_time_str = data.get('end_time')
        end_time = datetime.strptime(end_time_str, '%H:%M').time()
        
        new_event = Event(
            title=data.get('title'),
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
            location=data.get('location'),
            amount=data.get('amount'),
            description=data.get('description'),
            owner_id=data.get('owner_id'))
        db.session.add(new_event)
        db.session.commit()

        return make_response(jsonify({'message': 'Event created successfully'}), 201)

        
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user_id = current_user.get('id')
        events = Event.query.filter(Event.users.any(id=user_id)).all()
        events_list = [
            {
                "id": event.id,
                "title": event.title,
                "start_date": event.start_date,
                "end_date": event.end_date,
                "start_time": event.start_time,
                "end_time": event.end_time,
                "location": event.location,
                "amount": event.amount,
                "progress": event.progress,
                "description": event.description,
                "owner": event.owner.first_name,
            }
            for event in events
        ]
        return make_response(jsonify(events_list))
    
class AllTasks(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()

        # Convert start date string to Python date object
        start_date_str = data.get('start_date')
        start_date = datetime.strptime(start_date_str, '%m/%d/%Y').date()
        
        # Convert end date string to Python date object
        end_date_str = data.get('end_date')
        end_date = datetime.strptime(end_date_str, '%m/%d/%Y').date()
        
        # Convert start time string to Python time object
        start_time_str = data.get('start_time')
        start_time = datetime.strptime(start_time_str, '%H:%M').time()
        
        # Convert end time string to Python time object
        end_time_str = data.get('end_time')
        end_time = datetime.strptime(end_time_str, '%H:%M').time()

        new_task = Task(
            title=data.get('title'),
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
            location=data.get('location'),
            amount=data.get('amount'),
            description=data.get('description'),
            event_id=data.get('event_id'))
        db.session.add(new_task)
        db.session.commit()

        return make_response(jsonify({'message': 'Task created successfully'}), 201)
        
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user_id = current_user.get('id')
        tasks = Task.query.all()
        tasks_list = [
            {
                "id": task.id,
                "title": task.title,
                "start_date": task.start_date,
                "end_date": task.end_date,
                "start_time": task.start_time,
                "end_time": task.end_time,
                "location": task.location,
                "amount": task.amount,
                "progress": task.progress,
                "description": task.description,
            }
            for task in tasks
        ]
        return make_response(jsonify(tasks_list))


api.add_resource(Index, '/')
api.add_resource(AllUsers, '/users')
api.add_resource(LoginUser, '/login')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(AllEvents, '/events')
api.add_resource(AllTasks, '/tasks')

if __name__ == '__main__':
    app.run(port=5555)