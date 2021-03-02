from flask_restful import Resource, reqparse, request, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.LoginService import LoginService
from models import User
from hashlib import blake2b
import base64

# Class for handling login requests
class Login(Resource):

    # GET /login?username&password
    def get(self):
        # Decoding the auth header
        authInfo = request.headers.get('Authorization')
        decoded = str(base64.b64decode(authInfo), 'utf-8')
        username = decoded[0:decoded.find(":")]
        password = decoded[decoded.find(":")+1:]
        # Hashing the auth info
        passwordHash = blake2b(str(password).encode('utf-8')).hexdigest()
        # Checking validity of credentials
        loginService = LoginService()
        user = loginService.getUserInfo(username, passwordHash)
        # Returning if the authToken is unsuccessful
        if not user:
            return jsonify(success=False)

        # Check to see if the user is active
        if not user.isActive:
            return jsonify(success=False, active=False)

        # Returning the authToken is successful
        # if user.image is None:
        #     user.image = "https://ui-avatars.com/api/?background=006699&color=fff&name=" + user.name
        return jsonify(success=True, authToken=user.authToken, name=user.name, email=user.email, type=user.type, image=user.image)
