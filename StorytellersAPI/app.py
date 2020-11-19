from flask import Flask
from flask_restful import Api
from Resources.TestResource import Hello
from config import Config
from extensions import db

from Resources.LoginResource import Login
from Resources.RegisterResource import Register

app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)
db.init_app(app)
api.add_resource(Hello, '/hello', '/')

# GET /login?username&password
api.add_resource(Login, '/login')

# POST /register?name&email&username&password
api.add_resource(Register, '/register')

if __name__ == '__main__':
    app.run()
