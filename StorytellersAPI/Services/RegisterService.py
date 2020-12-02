from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from extensions import db
from models import User, VerificationCode
from sqlalchemy.exc import *
# import stmplib
from random import randint

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
            self.validate_email(emailInput, nameInput)
            return True
        except Exception as e:
            print(e)
            return False

    def validate_email(self, email, name):
        code = randint(100000, 999999)
        message = "Dear, " + name + "\nWelcome to storytellers of Canada." + """
        We are very happy that you could join us.
        
        Please enter this one time code to validate your email.
        """ + str(code) + """
        Thanks,
        
        Storytellers of Canada
        """
        print("Validation code is" + str(code))
        try:
            verification_code = VerificationCode(email=email, code=str(code))
            db.session.add(verification_code)
            db.session.commit()
        except Exception as e:
            print(e)




