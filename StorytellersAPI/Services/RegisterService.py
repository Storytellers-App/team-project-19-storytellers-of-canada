from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from extensions import db
from models import User
from sqlalchemy.exc import *

# Class for handling registration
class RegisterService:

    def register(self, nameInput, emailInput, usernameInput, passwordInput):
        try:
            user = User(username=usernameInput, 
                password=passwordInput, 
                name=nameInput, 
                email=emailInput, 
                authToken=usernameInput + "AUTH")
            # Adding this new user to the DB
            db.session.add(user)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return False