from flask import Flask
from flask_restful import Api
from Resources.TestResource import Hello
from config import Config
from extensions import db

app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)
db.init_app(app)
api.add_resource(Hello, '/hello', '/')

if __name__ == '__main__':
    app.run()
