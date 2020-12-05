from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from extensions import db
from models import User, VerificationCode
from sqlalchemy.exc import *
from Services.EmailVerificationService import EmailVerificationService
from random import randint
from uuid import uuid4



# Class for handling registration
class RegisterService:

    def register(self, nameInput, emailInput, usernameInput, passwordInput):
        try:
            # Generating a new auth token
            newAuth = uuid4()
            user = User(username=usernameInput,
                password=passwordInput,
                name=nameInput,
                email=emailInput,
                authToken=str(newAuth),
                isActive=False)

            # Adding this new user to the DB
            db.session.add(user)
            db.session.commit()
            emailService = EmailVerificationService()
            emailService.validate_new_email(emailInput, nameInput)
            return True
        except Exception as e:
            print(e)
            return False
