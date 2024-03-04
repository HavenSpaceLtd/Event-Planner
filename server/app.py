from flask import Flask, make_response, request, jsonify, session
from flask_migrate import Migrate
from database import db
from functools import wraps
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import os
from models.event import Event
from models.user import User
from models.task import Task

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

# Create Migrations
migrate = Migrate(app, db)

# Create api instance
api = Api(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

db.init_app(app)

class Index(Resource):
    def get(self):
        return "<h1>Skidi Papa Papa</h1>"

class AllUsers(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = User.query.filter(User.id == current_user['user_id']).first()

        if not user.admin:
            return make_response(jsonify({'message': 'Permission denied!'}), 403)
        
        # Get form data
        email = request.form.get('email')

        # Check if user with the given email already exists
        existing_user = User.query.filter(User.email == email).first()
        if existing_user:
            return make_response(jsonify({"Error": f"Email account {email} already exists"}), 409)

        # If the email is unique, proceed with creating the new user
        new_user = User(first_name=request.form.get('first_name'),
                          last_name=request.form.get('last_name'),
                          phone=request.form.get('phone'),
                          title=request.form.get('title'),
                          email=request.form.get('email'),
                          location=request.form.get('location'),
                          password=bcrypt.generate_password_hash(request.form.get('password')),
                          )
        
        user = User.query.filter(User.email == new_user.email).first()
        if user is not None:
            return make_response(jsonify({"Error": f"Email account {new_user.email} already exists"}), 409)
        
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
    
class LoginUser(Resource):
    def post(self):
        email = request.form.get('email')
        password = request.form.get('password')
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
            }), 200)
        
    def delete(self):
        session.pop("user_id", None)
        return make_response(jsonify({"Message": "Logout successful!"}), 200)

api.add_resource(Index, '/')
api.add_resource(AllUsers, '/users')
api.add_resource(LoginUser, '/login')

if __name__ == '__main__':
    app.run(port=5555)
