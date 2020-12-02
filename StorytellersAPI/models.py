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


class VerificationCode(db.Model):
    __tablename__ = 'VerificationCodes'
    email = db.Column(db.String(255), primary_key=True, nullable=False)
    code = db.Column(db.String(255), primary_key=False, nullable=False)


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
    parentType = db.Column(db.String(45))
    approved = db.Column(db.Boolean, nullable=False, default=False)
    image = db.Column(db.String(500))
    type = db.Column(db.String(455), nullable=False,
                     default=StoryType.USER.value)
    numLikes = db.Column(db.Integer)
    numReplies = db.Column(db.Integer)
    approvedTime = db.Column(db.DateTime)


class Tag(db.Model):
    __tablename__ = 'Tags'
    storyid = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(100), primary_key=True)


class Comment(db.Model):
    __tablename__ = 'Comments'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255))
    creationTime = db.Column(db.DateTime, nullable=False)
    comment = db.Column(db.String(1000), nullable=False)
    parent = db.Column(db.Integer)
    parentType = db.Column(db.String(45))
    approved = db.Column(db.Boolean, nullable=False, default=False)
    type = db.Column(db.String(455), nullable=False,
                     default='comment')
    numLikes = db.Column(db.Integer, default=0)
    numReplies = db.Column(db.Integer, default=0)
    approvedTime = db.Column(db.DateTime)


class Like(db.Model):
    __tablename__ = 'Likes'
    postId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), primary_key=True)
    postType = db.Column(db.String(455), primary_key=True,
                         default=StoryType.USER.value)
