from flask import Flask
from flask_restful import Api
from Resources.TestResource import Hello
from config import Config
from extensions import db

from Resources.LoginResource import Login
from Resources.RegisterResource import Register
from Resources.StoriesResource import Stories, Responses

app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)
db.init_app(app)

# GET /login?username&password
api.add_resource(Login, '/login')

# POST /register?name&email&username&password
api.add_resource(Register, '/register')
api.add_resource(Stories, '/stories')
api.add_resource(Responses, '/stories/responses')

if __name__ == '__main__':
    # host = '' # ip host address
    # app.run(host=host)
    app.run()
