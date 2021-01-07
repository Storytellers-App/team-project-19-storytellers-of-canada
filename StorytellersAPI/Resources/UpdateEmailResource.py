from flask_restful import Resource, reqparse, request, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from models import User
from Services.GetUserService import GetUserService
from extensions import db

class UpdateEmail(Resource):

    # POST /updateName?name
    def post(self):
        # Getting the user's auth token
        authToken = request.headers.get('Authorization')
        # Parsing the name
        parser = reqparse.RequestParser()
        parser.add_argument("email")
        args = parser.parse_args()
        # Updating the user's name
        try:
            user_service = GetUserService()
            temp_user = user_service.getUserWithAuthToken(authToken)
            temp_user.email=args["email"]
            db.session.commit()
            return jsonify(success=True, email=args["email"])
        except:
            return jsonify(success=False)