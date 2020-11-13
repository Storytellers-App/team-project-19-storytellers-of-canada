from flask import Flask
from flask_restful import Api
from Resources.LoginResource import Login
from Resources.RegisterResource import Register
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)


# GET /login?username&password
api.add_resource(Login, '/login')

# POST /register?name&email&username&password
api.add_resource(Register, '/register')

if __name__ == '__main__':
    app.run()
