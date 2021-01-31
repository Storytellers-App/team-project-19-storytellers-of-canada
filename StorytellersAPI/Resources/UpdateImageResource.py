from flask_restful import Resource, reqparse, request, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from models import User
from Services.GetUserService import GetUserService
from extensions import db
from Services.S3StoryService import *
import werkzeug.datastructures

class UpdateImage(Resource):

    # POST /updateName?name
    def post(self):
        # Getting the user's auth token
        authToken = request.headers.get('Authorization')
        # Parsing the image
        story_args = reqparse.RequestParser()
        story_args.add_argument(
            "image",
            type=werkzeug.datastructures.FileStorage,
            location="files",
            default=None,
        )
        args = story_args.parse_args()
        # Updating the user's profile pic
        try:
            user_service = GetUserService()
            temp_user = user_service.getUserWithAuthToken(authToken)
            # Uploading the new image
            story_service = S3StoryService()
            story_service.upload_fileobj(args.image, "sccanada", temp_user.username + ".png")
            image_url = story_service.get_url_from_key("sccanada", temp_user.username + ".png")
            temp_user.image = image_url
            db.session.commit()
            return jsonify(success=True, image=image_url)
        except Exception as e:
            print(e)
            return HTTPStatus.BAD_REQUEST

    def delete(self):
        # Getting the user's auth token
        authToken = request.headers.get('Authorization')

        # deleting the user's profile pic
        try:
            user_service = GetUserService()
            temp_user = user_service.getUserWithAuthToken(authToken)

            temp_user.image = None
            db.session.commit()
            return jsonify(success=True)
        except Exception as e:
            print(e)
            return HTTPStatus.BAD_REQUEST
