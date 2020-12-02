from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.EmailVerificationService import *


class EmailVerification(Resource):

    def post(self):
        # Parsing the registration parameters
        parser = reqparse.RequestParser()
        parser.add_argument("email")
        parser.add_argument("verification_token")
        args = parser.parse_args()

        # Checking validity of credentials
        validate_service = EmailVerificationService()
        success = validate_service.validate(args["email"],
                                            args["verification_token"])
        return jsonify(success=success)
