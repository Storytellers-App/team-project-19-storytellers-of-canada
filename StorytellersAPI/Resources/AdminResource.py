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
    'type': fields.String,
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
    'type': fields.String,
}


class Admin(Resource):
    def get(self):
        get_user_stories_args = reqparse.RequestParser()
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
                                                Story.numLikes,
                                                Story.numReplies,
                                                Story.type,
                                                Story.approvedTime).outerjoin(
                User, User.username == Story.username).order_by(
                Story.creationTime.desc(), Story.id.desc()).filter(
                Story.approved.is_(False)).filter(
                Story.creationTime < time).paginate(
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
                    'numLikes': story.numLikes,
                    'numReplies': story.numReplies,
                    'tags': [tag.tag for tag in tags],
                    'type': story.type,
                }
                if StoryType(story.type) == StoryType.USER:
                    marshal_list.append(marshal(format_story, userstory_fields))
                elif StoryType(story.type) == StoryType.SAVED:
                    marshal_list.append(marshal(format_story, storysave_fields))
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__['orig']))
        posts = {
            'posts': marshal_list
        }
        return posts, HTTPStatus.OK

    def post(self):
        get_user_stories_args = reqparse.RequestParser()
        get_user_stories_args.add_argument("id", type=int, required=True)
        get_user_stories_args.add_argument("approved", type=bool, default=True)
        get_user_stories_args.add_argument("type", type=str,
                                           default=StoryType.USER.value)

        args = get_user_stories_args.parse_args()

        try:
            if StoryType(args['type']) == StoryType.USER or StoryType(
                    args['type']) == StoryType.SAVED:
                story = Story.query.filter_by(id=args['id']).first()
                story.approved = args['approved']
                if story.approved:
                    story.approvedTime = func.now()
                else:
                    story.approvedTime = None
                db.session.commit()
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__['orig']))
        return HTTPStatus.OK
