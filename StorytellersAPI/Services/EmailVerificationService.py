from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from extensions import db
from models import VerificationCode, User
from sqlalchemy.exc import *
import sqlalchemy

# Class for handling registration


class EmailVerificationService:

    def validate(self, emailInput, validationTokenInput):
        try:
            code = VerificationCode.query.filter_by(email=emailInput).first()
            print("About to access code")
            print(code)
            valid = code.code == validationTokenInput

            if valid:
                # Delete the code
                try:
                    VerificationCode.query.filter_by(email=emailInput).delete()
                    db.session.commit()
                except Exception as e:
                    print(e)
                    return False

                # Update the user object
                try:
                    temp_user = self.getUser(code.email)
                    temp_user.isActive = True
                    db.session.commit()
                except Exception as e:
                    print(e)
                    return False

            return valid
        except Exception as e:
            print(e)
            return False

    def validateWithoutEmail(self, username, token):
        try:
            user = self.getUserWithUsername(username)
            email = user.email
            print("Validate without email")
            print(user)
            print(user.email)
            return self.validate(email, token)
        except Exception as e:
            print(e)
            return False

    def getUser(self, email):
        try:
            # Getting user's auth token information if it exists
            for user in db.session.query(User).filter_by(email=email):
                return user
            return False
        except:
            return False

    def getUserWithUsername(self, username):
        try:
            # Getting user's auth token information if it exists
            for user in db.session.query(User).filter_by(username=username):
                return user
            return False
        except:
            return False
