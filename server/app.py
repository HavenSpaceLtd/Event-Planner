from flask import Flask
from flask_cors import CORS  # Corrected import statement

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes by passing the app instance to CORS

@app.route('/')
def home():
    return "The Homepage"









if __name__ == '__main__':  # Corrected condition for conditional execution
    app.run(port=5555, debug=True)
