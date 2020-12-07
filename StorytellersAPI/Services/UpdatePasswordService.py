from config import Config
from extensions import db
from models import User
from sqlalchemy.exc import *
from hashlib import blake2b
from Services.GetUserService import GetUserService
from Services.EmailVerificationService import EmailVerificationService


class UpdatePasswordService:

    def _updatePassword(self, user, password):
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

        return self._updatePassword(user, password)

    def updatePasswordWithEmail(self, email, password, token):
        """
        Update the password given an email
        """
        user_service = GetUserService()
        user = user_service.getUserWithEmail(email)
        if user is None:
            # User does not exist
            return False

        validation_service = EmailVerificationService()
        valid = validation_service.validate(email, token)

        if valid:
            return self._updatePassword(user, password)
        else:
            return False
