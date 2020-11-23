from config import Config
from extensions import db
from models import User
from sqlalchemy.exc import *

# Class for handling DB access
class LoginService:

    # Getting an auth token given a username and password
    def getUserInfo(self, usernameInput, passwordInput):
        try:      
            # Getting user's auth token information if it exists
            for user in db.session.query(User).filter_by(username=usernameInput, password=passwordInput):
                return user
            return False
        except:
            return False