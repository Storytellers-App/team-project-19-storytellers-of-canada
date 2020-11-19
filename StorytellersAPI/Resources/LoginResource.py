from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.LoginService import LoginService

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
        authToken = loginService.getAuthToken(args["username"], args["password"])
        # Returning if the authToken is unsuccessful
        if authToken == -1:
            return jsonify(success=False)
        # Returning the authToken is successful
        return jsonify(success=True, authToken=authToken)