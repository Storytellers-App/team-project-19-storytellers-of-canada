from config import Config
from extensions import db
from models import User
from sqlalchemy.exc import *
from hashlib import blake2b
from Services.GetUserService import GetUserService


class UpdatePasswordService:

    def updatePassword(self, user, password):
        """
        Update the password for user
        """
        hashed_password = blake2b(str(password).encode('utf-8')).hexdigest()
        user.password = hashed_password
        db.session.commit()
        return True

    def updatePasswordWithUsername(self, username, password):
        """
        Update the password given a username
        """
        user_service = GetUserService()
        user = user_service.getUserWithUsername(username)
        if user is None:
            # User does not exist
            return False

        return self.updatePassword(user, password)

    def updatePasswordWithEmail(self, email, password):
        """
        Update the password given an email
        """
        user_service = GetUserService()
        user = user_service.getUserWithEmail(email)
        if user is None:
            # User does not exist
            return False

        return self.updatePassword(user, password)
