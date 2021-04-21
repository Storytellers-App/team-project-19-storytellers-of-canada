from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus

from Services.GetUserService import GetUserService
from extensions import db
from models import User, BlockedUser
from models import Story, Comment, Like
from sqlalchemy.exc import *
from sqlalchemy import func
from datetime import datetime
from common.Enums import StoryType

user_fields = {
    "username": fields.String,
    "name": fields.String,
    "image": fields.String,
}

class BlockUser(Resource):
    def get(self):
        set_block_args = reqparse.RequestParser()
        set_block_args.add_argument(
            "auth_token", type=str, required=True,
            help="user authentication token required"
        )
        args = set_block_args.parse_args()
        user_service = GetUserService()
        temp_user = user_service.getUserWithAuthToken(args['auth_token'])
        if temp_user is None:
            return HTTPStatus.BAD_REQUEST
        username = temp_user.username
        blockedUsers = BlockedUser.query.with_entities(BlockedUser.blockedUser, User.name, User.image).filter(BlockedUser.username == username).outerjoin(User, User.username == BlockedUser.blockedUser).all()
        marshal_list = []
        for user in blockedUsers:
            format = {
                "username": user.blockedUser, "name": user.name,
                 "image": user.image
            }
            marshal_list.append(format)

        return marshal(marshal_list, user_fields)


    def post(self):
        set_block_args = reqparse.RequestParser()

        set_block_args.add_argument("blockUser", type=str, required=True)
        set_block_args.add_argument(
            "auth_token", type=str, required=True,
            help="user authentication token required"
        )

        args = set_block_args.parse_args()
        user_service = GetUserService()
        temp_user = user_service.getUserWithAuthToken(args['auth_token'])
        if temp_user is None:
            return HTTPStatus.BAD_REQUEST
        username = temp_user.username


        blockUser = User.query.filter_by(username=args['blockUser']).first()
        if not blockUser:
            abort(HTTPStatus.NOT_FOUND, message='This user was not found')
        prev_block = BlockedUser.query.filter_by(username=username,
                                    blockedUser=args['blockUser']).first()
        if prev_block:
            return HTTPStatus.OK

        block = BlockedUser(username=username, blockedUser=args['blockUser'])
        try:
            db.session.add(block)
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not register block')
        return HTTPStatus.OK

class UnBlockUser(Resource):
    def post(self):
        set_block_args = reqparse.RequestParser()

        set_block_args.add_argument("blockUser", type=str, required=True)
        set_block_args.add_argument(
            "auth_token", type=str, required=True,
            help="user authentication token required"
        )

        args = set_block_args.parse_args()
        user_service = GetUserService()
        temp_user = user_service.getUserWithAuthToken(args['auth_token'])
        if temp_user is None:
            return HTTPStatus.BAD_REQUEST
        username = temp_user.username

        blockUser = User.query.filter_by(username=args['blockUser']).first()
        if not blockUser:
            abort(HTTPStatus.NOT_FOUND, message='This user was not found')
        prev_block = BlockedUser.query.filter_by(username=username,
                                               blockedUser=args[
                                                   'blockUser']).first()
        if prev_block is None:
            return HTTPStatus.OK


        try:
            db.session.delete(prev_block)
            db.session.commit()
        except SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST, message='Could not unblock user')
        return HTTPStatus.OK
