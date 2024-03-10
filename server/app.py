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
from models.collaboration import Collaboration
from models.budget import Budget
from models.expense import Expense
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
        return jsonify({"message": "Skidi Papa Papa"})


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
        image_file = request.files.get('image')  # Using get() instead of directly accessing dictionary to handle missing key

        if not image_file:
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
            image=image_path if image_file else None  # Assigning the path of the uploaded image if available
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
        current_user_id = get_jwt_identity().get('user_id')
        user = User.query.get(id)

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
        current_user_id = get_jwt_identity().get('user_id')
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
        current_user_id = get_jwt_identity().get('user_id')
        data = request.json

        # Handle image upload
        user = User.query.get(id)
        image_file = request.files.get('image')

        if not image_file:
            return make_response(jsonify({"error": "Image not found"}), 404)

        if user.id != current_user_id:
            return make_response(jsonify({"error": "Unauthorized!"}), 403)

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            user.image = image_path

            db.session.commit()

            updated_user_data = {"image": user.image}
            return make_response(jsonify(updated_user_data), 200)



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
                "start_date": event.start_date.strftime('%m/%d/%Y'),
                "end_date": event.end_date.strftime('%m/%d/%Y'),
                "start_time": event.start_time.strftime('%H:%M'),
                "end_time": event.end_time.strftime('%H:%M'),
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
                "start_date": task.start_date.strftime('%m/%d/%Y'),
                "end_date": task.end_date.strftime('%m/%d/%Y'),
                "start_time": task.start_time.strftime('%H:%M'),
                "end_time": task.end_time.strftime('%H:%M'),
                "location": task.location,
                "amount": task.amount,
                "progress": task.progress,
                "description": task.description,
            }
            for task in tasks
        ]
        return make_response(jsonify(tasks_list))


class ManageCollaborations(Resource):
    def post(self):
        data = request.json
        message = data.get('message')
        recipient_id = data.get('recipient_id')

        # Validate data
        if not message or not recipient_id:
            return jsonify({"Error": "Invalid data provided!"}), 400

        # Check if recipient exists
        recipient = User.query.get(recipient_id)
        if recipient is None:
            return jsonify({"Error": "Recipient does not exist!"}), 404

        # Create a new collaboration
        new_collaboration = Collaboration(message=message, recipient_id=recipient_id)
        db.session.add(new_collaboration)
        db.session.commit()

        return jsonify({"Message": "Collaboration added successfully!"}), 201

    def get(self):
        # Retrieve all collaborations
        collaborations = Collaboration.query.all()
        collaborations_list = [
            {
                "id": collab.id,
                "message": collab.message,
                "recipient_id": collab.recipient_id
            }
            for collab in collaborations
        ]
        return jsonify(collaborations_list)



class BudgetResource(Resource):
    def get(self, budget_id=None):
        if budget_id:
            budget = Budget.query.get(budget_id)
            if budget:
                return jsonify({
                    "id": budget.id,
                    "event_id": budget.event_id,
                    "amount": budget.amount
                })
            else:
                return jsonify({'message': 'Budget not found'}), 404
        else:
            budgets = Budget.query.all()
            budgets_list = [
                {
                    "id": budget.id,
                    "event_id": budget.event_id,
                    "amount": budget.amount
                }
                for budget in budgets
            ]
            return jsonify(budgets_list)

    def post(self):
        data = request.json
        event_id = data.get('event_id')
        amount_str = data.get('amount')

        if amount_str is None:
            return jsonify({'message': 'Amount is missing'}), 400

        try:
            # Convert amount string to float
            amount = float(amount_str.replace(',', ''))
        except ValueError:
            return jsonify({'message': 'Invalid amount format'}), 400

        new_budget = Budget(event_id=event_id, amount=amount)
        db.session.add(new_budget)
        db.session.commit()

        return jsonify({'message': 'Budget created successfully'}), 201

    def put(self, budget_id):
        data = request.json
        budget = Budget.query.get(budget_id)
        if budget:
            budget.event_id = data.get('event_id', budget.event_id)
            budget.amount = data.get('amount', budget.amount)
            db.session.commit()
            return jsonify({'message': 'Budget updated successfully'})
        else:
            return jsonify({'message': 'Budget not found'}), 404

    def delete(self, budget_id):
        budget = Budget.query.get(budget_id)
        if budget:
            db.session.delete(budget)
            db.session.commit()
            return jsonify({'message': 'Budget deleted successfully'})
        else:
            return jsonify({'message': 'Budget not found'}), 404


class ExpenseResource(Resource):
    def post(self):
        data = request.json
        amount = data.get('amount')
        category = data.get('category')
        description = data.get('description')
        event_id = data.get('event_id')

        # Check if event exists
        event = Event.query.get(event_id)
        if event is None:
            return jsonify({"Error": "Event does not exist!"}), 404

        # Create a new expense
        new_expense = Expense(
            amount=amount,
            category=category,
            description=description,
            event_id=event_id
        )
        db.session.add(new_expense)
        db.session.commit()

        return jsonify({"Message": "Expense added successfully!"}), 201

    def get(self):
        expenses = Expense.query.all()
        expenses_list = [
            {
                "id": expense.id,
                "amount": expense.amount,
                "category": expense.category,
                "description": expense.description,
                "event_id": expense.event_id
            }
            for expense in expenses
        ]
        return jsonify(expenses_list)

class ResourceResource(Resource):
    def post(self):
        data = request.json
        name = data.get('name')
        quantity = data.get('quantity')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        availability_status = data.get('availability_status')
        event_id = data.get('event_id')

        # Check if event exists
        event = Event.query.get(event_id)
        if event is None:
            return jsonify({"Error": "Event does not exist!"}), 404

        # Create a new resource
        new_resource = Resource(
            name=name,
            quantity=quantity,
            start_date=start_date,
            end_date=end_date,
            availability_status=availability_status,
            event_id=event_id
        )
        db.session.add(new_resource)
        db.session.commit()

        return jsonify({"Message": "Resource added successfully!"}), 201

    def get(self):
        resources = Resource.query.all()
        resources_dict = [
            {
                "id": resource.id,
                "name": resource.name,
                "quantity": resource.quantity,
                "start_date": resource.start_date.strftime('%m/%d/%Y') if resource.start_date else None,
                "end_date": resource.end_date.strftime('%m/%d/%Y') if resource.end_date else None,
                "availability_status": resource.availability_status,
                "event_id": resource.event_id
            }
            for resource in resources
        ]
        return jsonify(resources_dict)


api.add_resource(Index, '/')
api.add_resource(AllUsers, '/users')
api.add_resource(LoginUser, '/login')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(AllEvents, '/events')
api.add_resource(AllTasks, '/tasks')
api.add_resource(ManageCollaborations, '/collaborations')
api.add_resource(BudgetResource, '/budgets', '/budgets/<int:budget_id>')
api.add_resource(ExpenseResource, '/expenses')
api.add_resource(ResourceResource, '/resources')

if __name__ == '__main__':
    app.run(port=5555, debug=True)