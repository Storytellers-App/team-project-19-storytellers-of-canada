from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus
from extensions import db
from models import Story, User, Tag
from sqlalchemy.exc import *
from sqlalchemy import func
from datetime import datetime
from common.Enums import StoryType

user_fields = {
    'username': fields.String,
    'name': fields.String,
}

userstory_fields = {
    'id': fields.Integer,
    'user': fields.Nested(user_fields),
    'creationTime': fields.DateTime,
    'title': fields.String,
    'description': fields.String,
    'recording': fields.String,
    'parent': fields.Integer,
    'num_likes': fields.Integer,
    'num_replies': fields.Integer,
    'tags': fields.List(fields.String),
}
storysave_fields = {
    'id': fields.Integer,
    'author': fields.String,
    'creationTime': fields.DateTime,
    'title': fields.String,
    'description': fields.String,
    'recording': fields.String,
    'num_likes': fields.Integer,
    'num_replies': fields.Integer,
    'tags': fields.List(fields.String),
}


class Stories(Resource):
    def get(self):
        get_user_stories_args = reqparse.RequestParser()
        get_user_stories_args.add_argument("type", type=str,
                                           default=StoryType.USER.value)
        get_user_stories_args.add_argument("page", type=int, default=1)
        get_user_stories_args.add_argument("per_page", type=int, default=7)
        get_user_stories_args.add_argument("time",
                                           type=lambda x: datetime.strptime(x,
                                                                            '%Y-%m-%d %H:%M:%S'))
        args = get_user_stories_args.parse_args()
        time = None
        if 'time' in args and args['time'] is not None:
            time = args['time']
        if time is None:
            time = func.now()
        try:
            stories = Story.query.with_entities(Story.id,
                                                Story.username, User.name,
                                                Story.creationTime, Story.title,
                                                Story.description,
                                                Story.recording,
                                                Story.parent,
                                                Story.author,
                                                Story.image,
                                                Story.num_likes,
                                                Story.num_replies
                                                ).outerjoin(
                User, User.username == Story.username).order_by(
                Story.creationTime.desc(), Story.id.desc()).filter(
                Story.creationTime < time).filter(
                Story.type == args['type']).filter(
                Story.parent.is_(None)).paginate(
                args['page'], args['per_page'], False).items
            marshal_list = []
            for story in stories:
                tags = Tag.query.filter_by(storyid=story.id)
                format_story = {
                    'id': story.id,
                    'user': {'username': story.username,
                             'name': story.name},
                    'creationTime': story.creationTime,
                    'title': story.title,
                    'description': story.description,
                    'recording': story.recording,
                    'parent': story.parent,
                    'author': story.author,
                    'image': story.image,
                    'num_likes': story.num_likes,
                    'num_replies': story.num_replies,
                    'tags': [tag.tag for tag in tags]
                }
                marshal_list.append(format_story)
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__['orig']))
        if StoryType(args['type']) == StoryType.USER:
            return marshal(marshal_list, userstory_fields,
                           envelope='stories'), HTTPStatus.OK
        else:
            return marshal(marshal_list, storysave_fields,
                           envelope='stories'), HTTPStatus.OK


class Responses(Resource):
    @marshal_with(userstory_fields, envelope='responses')
    def get(self):
        get_responses_args = reqparse.RequestParser()
        get_responses_args.add_argument('id', type=int)
        # get_responses_args.add_argument("type", type=str,
        #                                 default=StoryType.USER.value)
        get_responses_args.add_argument("page", type=int, default=1)
        get_responses_args.add_argument("per_page", type=int, default=7)
        get_responses_args.add_argument("time",
                                        type=lambda x: datetime.strptime(x,
                                                                         '%Y-%m-%d %H:%M:%S'))
        args = get_responses_args.parse_args()
        time = None
        if 'time' in args and args['time'] is not None:
            time = args['time']
        if time is None:
            time = func.now()
        try:
            stories = Story.query.with_entities(Story.id,
                                                Story.username, User.name,
                                                Story.creationTime, Story.title,
                                                Story.description,
                                                Story.recording,
                                                Story.parent,
                                                Story.author,
                                                Story.image,
                                                Story.num_likes,
                                                Story.num_replies).outerjoin(
                User, User.username == Story.username).order_by(
                Story.creationTime.desc(), Story.id.desc()).filter(
                Story.creationTime < time).filter(
                Story.parent == args['id']).paginate(
                args['page'], args['per_page'], False).items
            marshal_list = []
            for story in stories:
                tags = Tag.query.filter_by(storyid=story.id)
                format_story = {
                    'id': story.id,
                    'user': {'username': story.username,
                             'name': story.name},
                    'creationTime': story.creationTime,
                    'title': story.title,
                    'description': story.description,
                    'recording': story.recording,
                    'parent': story.parent,
                    'author': story.author,
                    'image': story.image,
                    'num_likes': story.num_likes,
                    'num_replies': story.num_replies,
                    'tags': [tag.tag for tag in tags]
                }
                marshal_list.append(format_story)
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__['orig']))

        return marshal_list, HTTPStatus.OK
