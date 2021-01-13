from flask_restful import Resource, reqparse, request, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.GetUserService import GetUserService
from models import User
from hashlib import blake2b
import base64

# Class for handling login requests
class AuthTokenLogin(Resource):

    # GET /login?username&password
    def get(self):
        # Decoding the auth header
        authInfo = request.headers.get('Authorization')
        # Getting the user info with the authtoken
        try:
            user_service = GetUserService()
            user = user_service.getUserWithAuthToken(authInfo)
            return jsonify(success=True, username=user.username, authToken=user.authToken, name=user.name, email=user.email, type=user.type, image=user.image)
        except:
            return jsonify(success=False)
