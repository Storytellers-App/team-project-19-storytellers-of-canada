import sqlalchemy
from flask_restful import (
    Resource,
    reqparse,
    abort,
    fields,
    marshal_with,
    marshal,
    inputs,
)
from flask import Response
from http import HTTPStatus
from extensions import db
from models import Story, User, Tag, Comment, Like
from sqlalchemy.exc import *
from sqlalchemy import func, union_all
from datetime import datetime
from common.Enums import StoryType
import werkzeug.datastructures
from Services.S3StoryService import *

user_fields = {
    "username": fields.String,
    "name": fields.String,
}

userstory_fields = {
    "id": fields.Integer,
    "user": fields.Nested(user_fields),
    "creationTime": fields.DateTime,
    "title": fields.String,
    "description": fields.String,
    "recording": fields.String,
    "parent": fields.Integer,
    "numLikes": fields.Integer,
    "numReplies": fields.Integer,
    "tags": fields.List(fields.String),
    "type": fields.String,
    "isLiked": fields.Boolean,
}
storysave_fields = {
    "id": fields.Integer,
    "author": fields.String,
    "creationTime": fields.DateTime,
    "title": fields.String,
    "description": fields.String,
    "recording": fields.String,
    "numLikes": fields.Integer,
    "numReplies": fields.Integer,
    "tags": fields.List(fields.String),
    "type": fields.String,
    "isLiked": fields.Boolean,
}

comment_fields = {
    "id": fields.Integer,
    "user": fields.Nested(user_fields),
    "creationTime": fields.DateTime,
    "comment": fields.String,
    "numLikes": fields.Integer,
    "numReplies": fields.Integer,
    "type": fields.String,
    "isLiked": fields.Boolean,
}


class Stories(Resource):
    def __init__(self):
        self.s3_service = S3StoryService()

    def put(self):
        story_args = reqparse.RequestParser()
        story_args.add_argument("username", type=str, default=None)
        story_args.add_argument("author", type=str, default=None)
        # generate new creation time
        creation_time = datetime.now()
        story_args.add_argument("title", type=str, required=True)
        story_args.add_argument("description", type=str, default=None)
        story_args.add_argument(
            "recording",
            type=werkzeug.datastructures.FileStorage,
            location="files",
            required=True,
        )
        story_args.add_argument("parent", type=int, default=None)
        story_args.add_argument("parent_type", type=str, default=None)
        story_args.add_argument("approved", type=bool, default=False)
        story_args.add_argument(
            "image",
            type=werkzeug.datastructures.FileStorage,
            location="files",
            required=True,
        )
        num_likes = 0
        num_replies = 0
        story_args.add_argument("approved_time", type=inputs.datetime_from_iso8601)
        args = story_args.parse_args()
        ret = self.s3_service.add_story(
            username=args.username,
            author=args.author,
            creationTime=creation_time,
            title=args.title,
            description=args.description,
            recording=args.recording,
            parent=args.parent,
            parentType=args.parent_type,
            approved=args.approved,
            image=args.image,
            approvedTime=args.approved_time,
            numLikes=num_likes,
            numReplies=num_replies,
            type=None,
        )
        if not ret:
            return abort(500, description="Error in add_story in S3StoriesResource.")
        else:
            return Response(status=201)

    def get(self):
        get_user_stories_args = reqparse.RequestParser()
        get_user_stories_args.add_argument(
            "type", type=str, default=StoryType.USER.value
        )
        get_user_stories_args.add_argument("page", type=int, default=1)
        get_user_stories_args.add_argument("username", type=str)
        get_user_stories_args.add_argument("per_page", type=int, default=7)
        get_user_stories_args.add_argument(
            "time", type=lambda x: datetime.strptime(x, "%Y-%m-%d %H:%M:%S")
        )

        story_args = get_user_stories_args.parse_args()
        time = None
        if "time" in story_args and story_args["time"] is not None:
            time = story_args["time"]
        if time is None:
            time = func.now()
        try:
            stories = (
                Story.query.with_entities(
                    Story.id,
                    Story.username,
                    User.name,
                    Story.creationTime,
                    Story.title,
                    Story.description,
                    Story.recording,
                    Story.parent,
                    Story.author,
                    Story.image,
                    Story.numLikes,
                    Story.numReplies,
                    Story.type,
                    Story.approvedTime,
                )
                .outerjoin(User, User.username == Story.username)
                .order_by(Story.creationTime.desc(), Story.id.desc())
                .filter(Story.type == story_args["type"])
                .filter(Story.parent.is_(None))
                .filter(Story.approved.is_(True))
                .filter(Story.approvedTime < time)
                .paginate(story_args["page"], story_args["per_page"], False)
                .items
            )
            marshal_list = []
            for story in stories:
                tags = Tag.query.filter_by(storyid=story.id)
                isLiked = False
                if "username" in story_args and story_args["username"] is not None:
                    isLiked = (
                        Like.query.filter_by(
                            username=story_args["username"],
                            postId=story.id,
                            postType=story.type,
                        ).count()
                        > 0
                    )
                format_story = {
                    "id": story.id,
                    "user": {"username": story.username, "name": story.name},
                    "creationTime": story.creationTime,
                    "title": story.title,
                    "description": story.description,
                    "recording": story.recording,
                    "parent": story.parent,
                    "author": story.author,
                    "image": story.image,
                    "numLikes": story.numLikes,
                    "numReplies": story.numReplies,
                    "type": story.type,
                    "isLiked": isLiked,
                    "tags": [tag.tag for tag in tags],
                }
                marshal_list.append(format_story)
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__["orig"]))
        if StoryType(story_args["type"]) == StoryType.USER:
            return (
                marshal(marshal_list, userstory_fields, envelope="stories"),
                HTTPStatus.OK,
            )
        else:
            return (
                marshal(marshal_list, storysave_fields, envelope="stories"),
                HTTPStatus.OK,
            )


class Responses(Resource):
    def get(self):
        get_responses_args = reqparse.RequestParser()
        get_responses_args.add_argument("id", type=int)
        get_responses_args.add_argument("type", type=str, default=StoryType.USER.value)
        get_responses_args.add_argument("username", type=str)
        get_responses_args.add_argument("page", type=int, default=1)
        get_responses_args.add_argument("per_page", type=int, default=7)
        get_responses_args.add_argument(
            "time", type=lambda x: datetime.strptime(x, "%Y-%m-%d %H:%M:%S")
        )
        args = get_responses_args.parse_args()
        time = None
        if "time" in args and args["time"] is not None:
            time = args["time"]
        if time is None:
            time = func.now()
        try:
            stories = Story.query.with_entities(
                Story.id.label("id"),
                Story.username.label("username"),
                Story.creationTime.label("creationTime"),
                Story.title.label("title"),
                Story.description.label("description"),
                Story.recording.label("recording"),
                Story.parent.label("parent"),
                Story.parentType.label("parentType"),
                Story.author.label("author"),
                Story.image.label("image"),
                Story.type.label("type"),
                Story.approved.label("approved"),
                Story.numLikes.label("numLikes"),
                Story.numReplies.label("numReplies"),
                Story.approvedTime.label("approvedTime"),
                sqlalchemy.sql.null().label("comment"),
            )
            comments = Comment.query.with_entities(
                Comment.id.label("id"),
                Comment.username.label("username"),
                Comment.creationTime.label("creationTime"),
                sqlalchemy.sql.null().label("title"),
                sqlalchemy.sql.null().label("description"),
                sqlalchemy.sql.null().label("recording"),
                Comment.parent.label("parent"),
                Comment.parentType.label("parentType"),
                sqlalchemy.sql.null().label("author"),
                sqlalchemy.sql.null().label("image"),
                Comment.type.label("type"),
                Comment.approved.label("approved"),
                Comment.numLikes.label("numLikes"),
                Comment.numReplies.label("numReplies"),
                Comment.approvedTime.label("approvedTime"),
                Comment.comment.label("comment"),
            )

            both = stories.union(comments).subquery()

            responses = (
                db.session.query(both)
                .with_entities(
                    both.c.id,
                    both.c.username,
                    User.name,
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
                    both.c.approvedTime,
                )
                .outerjoin(User, User.username == both.c.username)
                .order_by(both.c.creationTime.desc(), both.c.id.desc())
                .filter(both.c.approved.is_(True))
                .filter(both.c.approvedTime < time)
                .filter(both.c.parentType == args["type"])
                .filter(both.c.parent == args["id"])
                .paginate(args["page"], args["per_page"], False)
                .items
            )
            marshal_list = []
            for response in responses:
                tags = []
                if (
                    response.type == StoryType.USER.value
                    or response.type == StoryType.SAVED.value
                ):
                    tags = Tag.query.filter_by(storyid=response.id)
                isLiked = False
                if "username" in args and args["username"] is not None:
                    isLiked = (
                        Like.query.filter_by(
                            username=args["username"],
                            postId=response.id,
                            postType=response.type,
                        ).count()
                        > 0
                    )
                format_response = {
                    "id": response.id,
                    "user": {"username": response.username, "name": response.name},
                    "creationTime": response.creationTime,
                    "title": response.title,
                    "description": response.description,
                    "recording": response.recording,
                    "parent": response.parent,
                    "author": response.author,
                    "image": response.image,
                    "numLikes": response.numLikes,
                    "numReplies": response.numReplies,
                    "comment": response.comment,
                    "type": response.type,
                    "isLiked": isLiked,
                    "tags": [tag.tag for tag in tags],
                }
                if response.type == StoryType.USER.value:
                    marshal_list.append(marshal(format_response, userstory_fields))
                elif response.type == StoryType.SAVED.value:
                    marshal_list.append(marshal(format_response, storysave_fields))
                else:
                    marshal_list.append(marshal(format_response, comment_fields))
        except SQLAlchemyError as e:
            abort(HTTPStatus.BAD_REQUEST, message=str(e.__dict__["orig"]))
        responses = {"responses": marshal_list}
        return responses, HTTPStatus.OK
