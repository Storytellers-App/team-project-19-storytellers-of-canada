from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.EmailVerificationService import *


class EmailVerificationWithUsername(Resource):

    def post(self):
        # Parsing the registration parameters
        print("With username")
        parser = reqparse.RequestParser()
        parser.add_argument("username", location='headers')
        parser.add_argument("token", location='headers')
        args = parser.parse_args()

        # Checking validity of credentials
        validate_service = EmailVerificationService()
        success = validate_service.validateWithoutEmail(args["username"],
                                                        args["token"])
        return jsonify(success=success)
