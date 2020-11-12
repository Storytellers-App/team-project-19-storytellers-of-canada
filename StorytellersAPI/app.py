from flask import Flask
from flask_restful import Api
from Resources.TestResource import Hello
from Resources.LoginResource import Login
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)

api.add_resource(Hello, '/hello', '/')

# GET /login?username&password
api.add_resource(Login, '/login')

if __name__ == '__main__':
    app.run()
