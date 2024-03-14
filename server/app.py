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
from models.assignment import Assignment
from models.budget import Budget
from models.expense import Expense
from models.asset import Asset
from models.collaboration import Collaboration
from models.communication import Communication
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


#To get user details by ID including a users' events, tasks, due tasks,
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
            "events": user.get_owned_events(),
            "tasks": user.get_assigned_tasks(),
            "due_tasks": user.get_assigned_tasks_due_within_week(),
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
            "events": user.get_owned_events(),
            "tasks": user.get_assigned_tasks(),
            "due_tasks": user.get_assigned_tasks_due_within_week(),
        }), 200)

    def delete(self):
        #session.pop("user_id", None)
        return make_response(jsonify({"Message": "Logout successful!"}), 200)
    
#To create a new event or get all events for the event planner
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
        user_id = current_user.get('user_id')
        user = User.query.get(user_id)

        if (user.title == "planner"):
            events = Event.query.all()

        if (user.title == "user"):
            events = Event.query.filter_by(owner_id = user_id).all()
        
        events_list = [
            {
                "id": event.id,
                "title": event.title,
                "start_date": event.start_date,
                "end_date": event.end_date,
                'start_time': event.start_time.strftime('%H:%M') if event.start_time else None,
                'end_time': event.end_time.strftime('%H:%M') if event.end_time else None,
                "location": event.location,
                "amount": event.amount,
                "progress": event.progress,
                "description": event.description,
                "owner": event.owner.first_name,
            }
            for event in events
        ]
        return make_response(jsonify(events_list))

#To get or update a specific event by ID
class EventById(Resource):
    @jwt_required()
    def get(self, event_id):
        event = Event.query.get(event_id)
        if not event:
            return make_response(jsonify({'message': 'Event not found'}), 404)

        return make_response(jsonify(event.to_dict()), 200)

    @jwt_required()
    def patch(self, event_id):
        data = request.get_json()
        event = Event.query.get(event_id)
        if not event:
            return make_response(jsonify({'message': 'Event not found'}), 404)

        event.title = data.get('title', event.title)
        event.start_date = datetime.strptime(data.get('start_date', event.start_date), '%m/%d/%Y').date()
        event.end_date = datetime.strptime(data.get('end_date', event.end_date), '%m/%d/%Y').date()
        event.start_time = datetime.strptime(data.get('start_time', event.start_time), '%H:%M').time()
        event.end_time = datetime.strptime(data.get('end_time', event.end_time), '%H:%M').time()
        event.amount = data.get('amount', event.amount)
        event.progress = data.get('progress', event.progress)
        event.status = data.get('progress', event.status)
        event.location = data.get('location', event.location)
        event.description = data.get('description', event.description)

        db.session.commit()
        return make_response(jsonify({'message': 'Event updated successfully'}), 200)

    @jwt_required()
    def delete(self, event_id):
        event = Event.query.get(event_id)
        if not event:
            return make_response(jsonify({'message': 'Event not found'}), 404)

        db.session.delete(event)
        db.session.commit()
        return make_response(jsonify({'message': 'Event deleted successfully'}), 200)

#To post a new task and assign it to a specific event
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

#To get a specfic task by ID in order to update details
class TaskById(Resource):
    @jwt_required()
    def get(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return make_response(jsonify({'message': 'Task not found'}), 404)

        return make_response(jsonify(task.to_dict()), 200)

    @jwt_required()
    def patch(self, task_id):
        data = request.get_json()
        task = Task.query.get(task_id)
        if not task:
            return make_response(jsonify({'message': 'Task not found'}), 404)

        task.title = data.get('title', task.title)
        task.start_date = datetime.strptime(data.get('start_date', task.start_date), '%m/%d/%Y').date()
        task.end_date = datetime.strptime(data.get('end_date', task.end_date), '%m/%d/%Y').date()
        task.start_time = datetime.strptime(data.get('start_time', task.start_time), '%H:%M').time()
        task.end_time = datetime.strptime(data.get('end_time', task.end_time), '%H:%M').time()
        task.amount = data.get('amount', task.amount)
        task.progress = data.get('progress', task.progress)
        task.location = data.get('location', task.location)
        task.status = data.get('status', task.status)
        task.description = data.get('description', task.description)

        db.session.commit()
        return make_response(jsonify({'message': 'Task updated successfully'}), 200)

    @jwt_required()
    def delete(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return make_response(jsonify({'message': 'Task not found'}), 404)

        db.session.delete(task)
        db.session.commit()
        return make_response(jsonify({'message': 'Task deleted successfully'}), 200)

#To assign a specific user to an event
class Teams(Resource):
    @jwt_required()
    def post(self):

        data = request.get_json()
        team_entry = Team(
            user_id = data.get('user_id'),
            event_id = data.get('event_id')
        )

        db.session.add(team_entry)
        db.session.commit()

        return make_response(jsonify({'message': 'Team updated'}), 201)

#To assign a specific user to a task    
class Assignments(Resource):
    @jwt_required()
    def post(self):

        data = request.get_json()
        new_assignment = Assignment(
            user_id = data.get('user_id'),
            task_id = data.get('task_id')
        )

        db.session.add(new_assignment)
        db.session.commit()

        return make_response(jsonify({'message': 'Assignment updated'}), 201)

class ManageCommunications(Resource):
    @jwt_required()
    def post(self):
        data = request.json
        message = data.get('message')
        recipient_id = data.get('recipient_id')

        # Validate data
        if not message or not recipient_id:
            return make_response(jsonify({"Error": "Invalid data provided!"}), 400)

        # Check if recipient exists
        recipient = User.query.get(recipient_id)
        if recipient is None:
            return make_response(jsonify({"Error": "Recipient does not exist!"}), 404)

        # Create a new communication
        new_communication = Communication(message=message, recipient_id=recipient_id)
        db.session.add(new_communication)
        db.session.commit()

        return make_response(jsonify({"Message": "Communication made successfully!"}), 201)

    @jwt_required()
    def get(self):
        # Retrieve all communications
        communications = Communication.query.all()
        communications_list = [
            {
                "id": commun.id,
                "message": commun.message,
                "recipient_id": commun.recipient_id
            }
            for commun in communications
        ]
        return make_response(jsonify(communications_list), 200)



class BudgetResource(Resource):
    @jwt_required()
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
                return make_response(jsonify({'message': 'Budget not found'}), 404)
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
            return make_response(jsonify(budgets_list))

    @jwt_required()
    def post(self):
        data = request.json
        event_id = data.get('event_id')
        amount_str = data.get('amount')

        if amount_str is None:
            return make_response(jsonify({'message': 'Amount is missing'}), 400)

        try:
            # Convert amount string to float
            amount = amount_str
        except ValueError:
            return make_response(jsonify({'message': 'Invalid amount format'}), 400)

        new_budget = Budget(event_id=event_id, amount=amount)
        db.session.add(new_budget)
        db.session.commit()

        return make_response(jsonify({'message': 'Budget created successfully'}), 201)

    @jwt_required()
    def put(self, budget_id):
        data = request.json
        budget = Budget.query.get(budget_id)
        if budget:
            budget.event_id = data.get('event_id', budget.event_id)
            budget.amount = data.get('amount', budget.amount)
            db.session.commit()
            return make_response(jsonify({'message': 'Budget updated successfully'}))
        else:
            return make_response(jsonify({'message': 'Budget not found'}), 404)

    @jwt_required()
    def delete(self, budget_id):
        budget = Budget.query.get(budget_id)
        if budget:
            db.session.delete(budget)
            db.session.commit()
            return make_response(jsonify({'message': 'Budget deleted successfully'}))
        else:
            return make_response(jsonify({'message': 'Budget not found'}), 404)


class ExpenseResource(Resource):
    @jwt_required()
    def post(self):
        data = request.json
        amount = data.get('amount')
        category = data.get('category')
        description = data.get('description')
        event_id = data.get('event_id')

        # Check if event exists
        event = Event.query.get(event_id)
        if event is None:
            return make_response(jsonify({"Error": "Event does not exist!"}), 404)

        # Create a new expense
        new_expense = Expense(
            amount=amount,
            category=category,
            description=description,
            event_id=event_id
        )
        db.session.add(new_expense)
        db.session.commit()

        return make_response(jsonify({"Message": "Expense added successfully!"}), 201)

    @jwt_required()
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
        return make_response(jsonify(expenses_list))

class BudgetReport(Resource):
    @jwt_required()
    def get(self, event_id):
        # Get total expenses for the event
        total_expenses = db.session.query(func.sum(Expense.amount)).filter_by(event_id=event_id).scalar()
        if total_expenses is None:
            total_expenses = 0

        # Get budget for the event
        budget = Budget.query.filter_by(event_id=event_id).first()
        if not budget:
            return make_response(jsonify({"error": "Budget not found for this event"}), 404)

        remaining_budget = budget.amount - total_expenses
        insights = ""
        if remaining_budget < 0:
            insights = "You have exceeded your budget!"
        elif remaining_budget < budget.amount * 0.25:
            insights = "You are running low on budget. Consider reducing expenses."
        elif total_expenses == 0:
            insights = "No expenses recorded yet."

        budget_report = {
            "event_id": event_id,
            "budget_amount": budget.amount,
            "total_expenses": total_expenses,
            "remaining_budget": remaining_budget,
            "insights": insights
        }
        return jsonify(budget_report)

class Assets(Resource):
    @jwt_required()
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
            return make_response(jsonify({"Error": "Event does not exist!"}), 404)

        # Create a new resource
        new_asset = Asset(
            name=name,
            quantity=quantity,
            start_date=start_date,
            end_date=end_date,
            availability_status=availability_status,
            event_id=event_id
        )
        db.session.add(new_asset)
        db.session.commit()

        return make_response(jsonify({"Message": "Resource added successfully!"}), 201)

    @jwt_required()
    def get(self):
        assets = Asset.query.all()
        assets_dict = [
            {
                "id": asset.id,
                "name": asset.name,
                "quantity": asset.quantity,
                "start_date": asset.start_date.strftime('%m/%d/%Y') if asset.start_date else None,
                "end_date": asset.end_date.strftime('%m/%d/%Y') if asset.end_date else None,
                "availability_status": asset.availability_status,
                "event_id": asset.event_id
            }
            for asset in assets
        ]
        return make_response(jsonify(assets_dict))

class CollaborationResource(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        data = request.json
        event_id = data.get('event_id')
        user_id = data.get('user_id')
        datetime = data.get('datetime')

        # Validate data
        if not all([event_id, user_id, datetime]):
            return make_response(jsonify({'error': 'Invalid data provided'}), 400)

        # Create a new collaboration
        new_collaboration = Collaboration(event_id=event_id, user_id=user_id, datetime=datetime)
        db.session.add(new_collaboration)
        db.session.commit()

        return make_response(jsonify({'message': 'Collaboration created successfully'}), 201)

    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        collaborations = Collaboration.query.all()
        collaborations_list = [{
            'id': collab.id,
            'event_id': collab.event_id,
            'user_id': collab.user_id,
            'datetime': collab.datetime.isoformat()
        } for collab in collaborations]
        return make_response(jsonify(collaborations_list), 200)

api.add_resource(Index, '/')
api.add_resource(AllUsers, '/users')
api.add_resource(LoginUser, '/login')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(AllEvents, '/events')
api.add_resource(AllTasks, '/tasks')
api.add_resource(Teams, '/teams')
api.add_resource(Assignments, '/assignments')
api.add_resource(EventById, '/events/<int:event_id>')
api.add_resource(TaskById, '/events/<int:task_id>')
api.add_resource(ManageCommunications, '/communications')
api.add_resource(BudgetResource, '/budgets', '/budgets/<int:budget_id>')
api.add_resource(ExpenseResource, '/expenses')
api.add_resource(Assets, '/assets')
api.add_resource(CollaborationResource, '/collaborations')
api.add_resource(BudgetReport, '/budget-report/<int:event_id>')

if __name__ == '__main__':
    app.run(port=5555)