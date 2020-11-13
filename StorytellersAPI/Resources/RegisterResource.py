from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.RegisterService import RegisterService

# Class for handling login requests
class Register(Resource):

    # POST /register?name&email&username&password
    def post(self):
        # Parsing the registration parameters
        parser = reqparse.RequestParser()
        parser.add_argument("name")
        parser.add_argument("email")
        parser.add_argument("username")
        parser.add_argument("password")
        args = parser.parse_args()
        # Checking validity of credentials
        registerService = RegisterService()
        success = registerService.register(args["name"], args["email"], args["username"], args["password"])
        return jsonify(success=success)
