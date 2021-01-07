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
        prev_like = Like.query.filter_by(username=args['username'],
                                    postId=args['id'],
                                    postType=args['type']).first()
        if prev_like:
            return HTTPStatus.OK

        like = Like(username=args['username'], postId=args['id'],
                    postType=args['type'])
        try:
            db.session.add(like)
            post.numLikes += 1
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not register like')
        return HTTPStatus.OK

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
        if post is None:
            return HTTPStatus.OK
        like = Like.query.filter_by(username=args['username'],
                                    postId=args['id'],
                                    postType=args['type']).first()
        if like is None:
            return HTTPStatus.OK
        try:
            db.session.delete(like)
            post.numLikes -= 1
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not remove like')
        return HTTPStatus.OK
