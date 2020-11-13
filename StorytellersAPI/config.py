import os


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL') or 'mysql+mysqlconnector://admin:+hB4+n#Y9Z?*Ca?Y@csc301storytellers.c6sjsmci2h7j.us-east-2.rds.amazonaws.com/storytellers_schema'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Gonna need to experiment with these if we get timeouts
    # SQLALCHEMY_ENGINE_OPTIONS = {
    #     'pool_recycle': 59,
    #     'pool_timeout': 20
    # }
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'PZti0RzxbE'
