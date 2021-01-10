from hashlib import blake2b

from flask_restful import Resource, reqparse, abort, fields, marshal_with, marshal
from flask import jsonify, Response
from http import HTTPStatus
from Services.EmailVerificationService import *
from Services.GDPRService import GDPRService
from Services.LoginService import LoginService


class GDPRResource(Resource):
    def __init__(self):
        self.service = GDPRService()

    def post(self):
        # Parsing the registration parameters
        parser = reqparse.RequestParser()
        parser.add_argument("username")
        parser.add_argument("password")
        parser.add_argument("email")
        args = parser.parse_args()

        try:
            # get user
            password_hash = blake2b(str(args.password).encode("utf-8")).hexdigest()
            login_service = LoginService()
            user = login_service.getUserInfo(args.username, password_hash)
            if not user:
                return abort(401, description="Invalid credentials, hash {}.".format(password_hash))
            if not user.isActive:
                return abort(401, description="User not active.")

            # make backend send all stuff to email
            self.service.send_gdpr_email(user, args.email)
        except:
            return abort(
                400,
                description="Invalid request. Please check the form fields and try again.",
            )

        return Response(status=201)
