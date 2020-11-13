from extensions import db
from common.Enums import *


class User(db.Model):
    __tablename__ = 'Users'
    username = db.Column(db.String(255), primary_key=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    authToken = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False,
                     default=UserType.MEMBER.value)
