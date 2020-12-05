from config import Config
from extensions import db
from models import User
from sqlalchemy.exc import *
from typing import Optional

class GetUserService:

    def getUserWithUsername(self, username) -> Optional[User]:
        """
        Gets a user object given their username
        """
        try:
            # Getting user's auth token information if it exists
            for user in db.session.query(User).filter_by(username=username):
                return user
            return None
        except:
            return None

    def getUserWithEmail(self, email) -> Optional[User]:
        """
        Gets a user object given their email
        """
        try:
            # Getting user's auth token information if it exists
            for user in db.session.query(User).filter_by(email=email):
                return user
            return None
        except:
            return None
