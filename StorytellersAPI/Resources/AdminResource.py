import sqlalchemy
from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus

from Services.GetUserService import GetUserService
from extensions import db
from models import Story, User, Tag, Comment
from sqlalchemy.exc import *
from sqlalchemy import func
from datetime import datetime
from common.Enums import StoryType, UserType

user_fields = {
    'username': fields.String,
    'name': fields.String,
    'image': fields.String,
}

userstory_fields = {
    'id': fields.Integer,
    'user': fields.Nested(user_fields),
    'creationTime': fields.DateTime,
    'title': fields.String,
    'description': fields.String,
    'recording': fields.String,
    'image': fields.String,
    'parent': fields.Integer,
    'parentType': fields.String,
    'numLikes': fields.Integer,
    'numReplies': fields.Integer,
    'tags': fields.List(fields.String),
    'type': fields.String,
    'isLiked': fields.Boolean,
}
storysave_fields = {
    'id': fields.Integer,
    'author': fields.String,
    'creationTime': fields.DateTime,
    'title': fields.String,
    'description': fields.String,
    'image': fields.String,
    'recording': fields.String,
    'numLikes': fields.Integer,
    'numReplies': fields.Integer,
    'tags': fields.List(fields.String),
    'type': fields.String,
    'isLiked': fields.Boolean,
}

comment_fields = {
    'id': fields.Integer,
    'user': fields.Nested(user_fields),
    'creationTime': fields.DateTime,
    'comment': fields.String,
    'numLikes': fields.Integer,
    'parent': fields.Integer,
    'parentType': fields.String,
    'numReplies': fields.Integer,
    'type': fields.String,
    'isLiked': fields.Boolean,
}


class Admin(Resource):
    def get(self):
        get_responses_args = reqparse.RequestParser()
        get_responses_args.add_argument("page", type=int, default=1)
        get_responses_args.add_argument("per_page", type=int, default=7)
        get_responses_args.add_argument("time",
                                        type=lambda x: datetime.strptime(x,
                                                                         '%Y-%m-%d %H:%M:%S'))
        get_responses_args.add_argument(
            "auth_token", type=str, required=True,
            help="user authentication token required"
        )

        args = get_responses_args.parse_args()
        user_service = GetUserService()
        temp_user = user_service.getUserWithAuthToken(args['auth_token'])
        if temp_user is None:
            return HTTPStatus.BAD_REQUEST
        if temp_user.type != UserType.ADMIN.value:
            return HTTPStatus.FORBIDDEN
        time = None
        if 'time' in args and args['time'] is not None:
            time = args['time']
        if time is None:
            time = func.now()
        try:
            stories = Story.query.with_entities(Story.id.label('id'),
                                                Story.username.label(
                                                    'username'),
                                                Story.creationTime.label(
                                                    'creationTime'),
                                                Story.title.label('title'),
                                                Story.description.label(
                                                    'description'),
                                                Story.recording.label(
                                                    'recording'),
                                                Story.parent.label('parent'),
                                                Story.parentType.label(
                                                    'parentType'),
                                                Story.author.label('author'),
                                                Story.image.label('image'),
                                                Story.type.label('type'),
                                                Story.approved.label(
                                                    'approved'),
                                                Story.numLikes.label(
                                                    'numLikes'),
                                                Story.numReplies.label(
                                                    'numReplies'),
                                                Story.approvedTime.label(
                                                    'approvedTime'),
                                                sqlalchemy.sql.null().label(
                                                    'comment'),
                                                Story.deleted.label('deleted'),
                                                )

            comments = Comment.query.with_entities(Comment.id.label('id'),
                                                   Comment.username.label(
                                                       'username'),
                                                   Comment.creationTime.label(
                                                       'creationTime'),
                                                   sqlalchemy.sql.null().label(
                                                       'title'),
                                                   sqlalchemy.sql.null().label(
                                                       'description'),
                                                   sqlalchemy.sql.null().label(
                                                       'recording'),
                                                   Comment.parent.label(
                                                       'parent'),
                                                   Comment.parentType.label(
                                                       'parentType'),
                                                   sqlalchemy.sql.null().label(
                                                       'author'),
                                                   sqlalchemy.sql.null().label(
                                                       'image'),
                                                   Comment.type.label('type'),
                                                   Comment.approved.label(
                                                       'approved'),
                                                   Comment.numLikes.label(
                                                       'numLikes'),
                                                   Comment.numReplies.label(
                                                       'numReplies'),
                                                   Comment.approvedTime.label(
                                                       'approvedTime'),
                                                   Comment.comment.label(
                                                       'comment'),
                                                   Comment.deleted.label(
                                                       'deleted'),
                                                   )

            both = stories.union(comments).subquery()

            responses = db.session.query(both).with_entities(both.c.id,
                                                             both.c.username,
                                                             User.name,
                                                             User.image.label(
                                                                 "userImage"),
                                                             both.c.creationTime,
                                                             both.c.title,
                                                             both.c.description,
                                                             both.c.recording,
                                                             both.c.parent,
                                                             both.c.comment,
                                                             both.c.type,
                                                             both.c.parentType,
                                                             both.c.author,
                                                             both.c.image,
                                                             both.c.numLikes,
                                                             both.c.numReplies,
                                                             both.c.approvedTime).outerjoin(
                User, User.username == both.c.username).order_by(
                both.c.creationTime.desc(), both.c.id.desc()).filter(
                both.c.approved.is_(False)).filter(
                both.c.creationTime < time).filter(
                both.c.deleted.is_(False)).paginate(
                args['page'], args['per_page'], False).items
            marshal_list = []
            for response in responses:
                tags = []
                if response.type == StoryType.USER.value or response.type == StoryType.SAVED.value:
                    tags = Tag.query.filter_by(storyid=response.id)
                format_response = {
                    'id': response.id,
                    "user": {"username": response.username, "name": response.name, "image": response.userImage},
                    'creationTime': response.creationTime,
                    'title': response.title,
                    'description': response.description,
                    'recording': response.recording,
                    'parent': response.parent,
                    'parentType': response.parentType,
                    'author': response.author,
                    'image': response.image,
                    'numLikes': response.numLikes,
                    'numReplies': response.numReplies,
                    'comment': response.comment,
                    'type': response.type,
                    'isLiked': False,
                    'tags': [tag.tag for tag in tags]
                }
                if response.type == StoryType.USER.value:
                    marshal_list.append(
                        marshal(format_response, userstory_fields))
                elif response.type == StoryType.SAVED.value:
                    marshal_list.append(
                        marshal(format_response, storysave_fields))
                else:
                    marshal_list.append(
                        marshal(format_response, comment_fields))
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__['orig']))
        posts = {
            'posts': marshal_list
        }
        return posts, HTTPStatus.OK

    def post(self):
        get_user_stories_args = reqparse.RequestParser()
        get_user_stories_args.add_argument("id", type=int, required=True)
        get_user_stories_args.add_argument("parent_type", type=str, default=StoryType.USER.value)
        get_user_stories_args.add_argument("approved", type=bool, default=True)
        get_user_stories_args.add_argument("type", type=str,
                                           default=StoryType.USER.value)
        get_user_stories_args.add_argument(
            "auth_token", type=str, required=True,
            help="user authentication token required"
        )

        args = get_user_stories_args.parse_args()
        user_service = GetUserService()
        temp_user = user_service.getUserWithAuthToken(args['auth_token'])
        if temp_user is None:
            return HTTPStatus.BAD_REQUEST
        if temp_user.type != UserType.ADMIN.value:
            return HTTPStatus.FORBIDDEN
        try:
            if args['type'] == StoryType.USER.value or args[
                'type'] == StoryType.SAVED.value:
                post = Story.query.filter_by(id=args['id']).first()
            else:
                post = Comment.query.filter_by(id=args['id']).first()
            if not post:
                abort(HTTPStatus.BAD_REQUEST, message='Could not find post')
            parent = None
            if post.parent is not None:
                if args['parent_type'] == "comment":
                    parent = Comment.query.filter_by(id=post.parent).first()
                else:
                    parent = Story.query.filter_by(id=post.parent).first()
            if args['approved']:
                if parent is not None and not post.approved:
                    parent.numReplies += 1
                post.approved = args['approved']
                post.approvedTime = func.now()
            else:
                post.approved = None
                post.approvedTime = None
            db.session.commit()
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__['orig']))
        return HTTPStatus.OK
