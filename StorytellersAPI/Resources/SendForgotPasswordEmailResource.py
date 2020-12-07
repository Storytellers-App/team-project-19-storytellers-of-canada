from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.EmailVerificationService import *


class SendForgotPasswordEmailResource(Resource):

    def post(self):
        # Parsing the registration parameters
        parser = reqparse.RequestParser()
        parser.add_argument("email", location='headers')
        args = parser.parse_args()

        # Checking validity of credentials
        email_service = EmailVerificationService()
        success = email_service.send_password_reset_email(args['email'])
        return jsonify(success=success)
