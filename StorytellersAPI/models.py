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


class Story(db.Model):
    __tablename__ = 'Stories'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255))
    author = db.Column(db.String(255))
    creationTime = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1000))
    recording = db.Column(db.String(500), nullable=False)
    parent = db.Column(db.Integer)
    approved = db.Column(db.Boolean, nullable=False, default=False)
    image = db.Column(db.String(500))
    type = db.Column(db.String(455), nullable=False,
                     default=StoryType.USER.value)
    # this will be a temporary solution to create likes
    # will need to add separate table later to store which user liked certain
    # posts as well
    num_likes = db.Column(db.Integer)
    num_replies = db.Column(db.Integer)
