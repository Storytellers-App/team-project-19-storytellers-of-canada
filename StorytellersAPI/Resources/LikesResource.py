from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus
from extensions import db
from models import User
from models import Story, Comment, Like
from sqlalchemy.exc import *
from sqlalchemy import func
from datetime import datetime
from common.Enums import StoryType


# temporary easy way to register likes
class AddLikes(Resource):
    def post(self):
        set_likes_args = reqparse.RequestParser()

        set_likes_args.add_argument("id", type=int)
        set_likes_args.add_argument("type", type=str,
                                    default=StoryType.USER.value)
        set_likes_args.add_argument("username", type=str)
        args = set_likes_args.parse_args()
        if args['type'] == 'comment':
            post = Comment.query.filter_by(id=args['id']).first()
        else:
            post = Story.query.filter_by(id=args['id']).first()
        if not post:
            abort(HTTPStatus.NOT_FOUND, message='This story was not found')
        post.numLikes += 1
        like = Like(username=args['username'], postId=args['id'],
                    postType=args['type'])
        db.session.add(like)
        try:
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not register like')


class RemoveLikes(Resource):
    def post(self):
        set_likes_args = reqparse.RequestParser()

        set_likes_args.add_argument("id", type=int, required=True)
        set_likes_args.add_argument("type", type=str,
                                    default=StoryType.USER.value)
        set_likes_args.add_argument("username", type=str, required=True)
        args = set_likes_args.parse_args()
        if args['type'] == 'comment':
            post = Comment.query.filter_by(id=args['id']).first()
        else:
            post = Story.query.filter_by(id=args['id']).first()
        if not post:
            return HTTPStatus.OK
        post.numLikes -= 1
        like = Like.query.filter_by(username=args['username'],
                                    postId=args['id'],
                                    postType=args['type'])
        db.session.delete(like)
        try:
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not remove like')
