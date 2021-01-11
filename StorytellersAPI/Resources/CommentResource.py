from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus

from Services.GetUserService import GetUserService
from common.Enums import UserType
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
        if args['parentType'] == 'comment':
            story = Comment.query.filter_by(id=args['parent']).first()
        else:
            story = Story.query.filter_by(id=args['parent']).first()
        if not story:
            abort(HTTPStatus.BAD_REQUEST, message='Item no longer exists')
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

    def delete(self):
        comment_args = reqparse.RequestParser()
        comment_args.add_argument(
            "id", type=str, required=True,
            help="ID of story not specified!"
        )
        comment_args.add_argument(
            "auth_token", type=str, required=True,
            help="user authentication token required"
        )
        args = comment_args.parse_args()
        user_service = GetUserService()
        try:
            comment = Comment.query.filter_by(id=args['id']).first()
            temp_user = user_service.getUserWithAuthToken(args['auth_token'])
            if temp_user.type != UserType.ADMIN.value and comment.username.lower() != temp_user.username.lower():
                return HTTPStatus.FORBIDDEN
            else:
                if comment.parent is not None:
                    parent_story = Story.query.filter_by(
                        id=comment.parent).first()
                    parent_story.numReplies -= 1
                comment.deleted = True
                db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
