from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus

from Services.GetUserService import GetUserService
from extensions import db
from models import User
from models import Story, Comment, Like
from sqlalchemy.exc import *
from sqlalchemy import func
from datetime import datetime
from common.Enums import StoryType


class Flag(Resource):
    def post(self):
        set_flag_args = reqparse.RequestParser()

        set_flag_args.add_argument("id", type=int)
        set_flag_args.add_argument("type", type=str,
                                   default=StoryType.USER.value)
        set_flag_args.add_argument(
            "auth_token", type=str, required=True,
            help="user authentication token required"
        )

        args = set_flag_args.parse_args()
        user_service = GetUserService()
        temp_user = user_service.getUserWithAuthToken(args['auth_token'])
        if temp_user is None:
            return HTTPStatus.BAD_REQUEST
        username = temp_user.username

        if args['type'] == 'comment':
            post = Comment.query.filter_by(id=args['id']).first()
        else:
            post = Story.query.filter_by(id=args['id']).first()
        if not post:
            abort(HTTPStatus.NOT_FOUND, message='This story was not found')

        if post.reported:
            return HTTPStatus.OK

        try:
            post.reported = True
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not register flag')
        return HTTPStatus.OK

