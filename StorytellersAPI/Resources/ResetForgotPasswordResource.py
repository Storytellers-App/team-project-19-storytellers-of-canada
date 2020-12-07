from flask_restful import Resource, request, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.RegisterService import RegisterService
from hashlib import blake2b
import base64
from Services.UpdatePasswordService import UpdatePasswordService


class ResetForgotPasswordResource(Resource):


    def post(self):
        # Parsing the registration parameters
        parser = reqparse.RequestParser()
        parser.add_argument("email", location='headers')
        parser.add_argument("password", location='headers')
        parser.add_argument("token", location='headers')
        args = parser.parse_args()
        update_password_service = UpdatePasswordService()
        success = update_password_service.\
            updatePasswordWithEmail(args['email'],
                                    args['password'],
                                    args['token'])
        return jsonify(success=success)
