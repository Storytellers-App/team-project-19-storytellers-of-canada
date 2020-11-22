from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus
from extensions import db
from models import User
from models import Story
from sqlalchemy.exc import *
from sqlalchemy import func
from datetime import datetime
from common.Enums import StoryType


# temporary easy way to register likes
class AddLikes(Resource):
    def post(self):
        set_likes_args = reqparse.RequestParser()

        set_likes_args.add_argument("id", type=int)
        set_likes_args.add_argument("username", type=str)
        args = set_likes_args.parse_args()
        story = Story.query.filter_by(id=args['id']).first()
        if not story:
            abort(HTTPStatus.NOT_FOUND, message='This story was not found')
        story.numLikes += 1
        try:
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not register like')


class RemoveLikes(Resource):
    def post(self):
        set_likes_args = reqparse.RequestParser()

        set_likes_args.add_argument("id", type=int)
        set_likes_args.add_argument("username", type=str)
        args = set_likes_args.parse_args()
        story = Story.query.filter_by(id=args['id']).first()
        if not story:
            return HTTPStatus.OK
        story.numLikes -= 1
        try:
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not register like')
