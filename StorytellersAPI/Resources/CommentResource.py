from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus
from extensions import db
from models import Comment, Story
from sqlalchemy.exc import *
from sqlalchemy import func


class CommentRes(Resource):
    def post(self):
        post_comment_args = reqparse.RequestParser()
        post_comment_args.add_argument('parent', type=int, required=True)
        post_comment_args.add_argument("parentType", type=str, required=True)
        post_comment_args.add_argument("username", type=str, required=True)
        post_comment_args.add_argument("comment", type=str, required=True)
        args = post_comment_args.parse_args()
        story = Story.query.filter_by(id=args['parent']).first()
        if not story:
            abort(HTTPStatus.BAD_REQUEST, message='Story no longer exists')
        comment = Comment(username=args['username'],
                          creationTime=func.now(),
                          parent=args['parent'],
                          parentType=args['parentType'],
                          comment=args['comment'])
        db.session.add(comment)
        try:
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not add comment')
        return HTTPStatus.OK
