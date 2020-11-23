from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.LoginService import LoginService
from models import User

# Class for handling login requests
class Login(Resource):

    # GET /login?username&password
    def get(self):
        # Parsing the login parameters
        parser = reqparse.RequestParser()
        parser.add_argument("username")
        parser.add_argument("password")
        args = parser.parse_args()
        # Checking validity of credentials
        loginService = LoginService()
        user = loginService.getUserInfo(args["username"], args["password"])
        # Returning if the authToken is unsuccessful
        if not user:
            return jsonify(success=False)
        # Returning the authToken is successful
        return jsonify(success=True, authToken=user.authToken, name=user.name, email=user.email, type=user.type)