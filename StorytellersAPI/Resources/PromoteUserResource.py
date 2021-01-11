from flask_restful import Resource, reqparse, request, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from models import User
from Services.GetUserService import GetUserService
from extensions import db


class PromoteUser(Resource):

    # POST /updateName?name
    def post(self):
        # Getting the user's auth token
        authToken = request.headers.get('Authorization')
        # Parsing the username
        parser = reqparse.RequestParser()
        parser.add_argument("username")
        args = parser.parse_args()

        # Ensure the current user is an admin
        try:
            user_service1 = GetUserService()
            temp_user1 = user_service1.getUserWithAuthToken(authToken)

            if temp_user1.type != "ADMIN":
                return jsonify(success=False, error="NOTADMIN")
        except:
            return jsonify(success=False, error="NOAUTH")

        # Updating the new user's type
        try:
            user_service2 = GetUserService()
            temp_user2 = user_service2.getUserWithUsername(args['username'])
            temp_user2.type = "ADMIN"
            db.session.commit()
            return jsonify(success=True)
        except:
            return jsonify(success=False, error="NOUSER")
