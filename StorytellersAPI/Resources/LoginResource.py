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
        usernameHash = blake2b(str(username).encode('utf-8')).hexdigest()
        passwordHash = blake2b(str(password).encode('utf-8')).hexdigest()
        # Checking validity of credentials
        loginService = LoginService()
        user = loginService.getUserInfo(usernameHash, passwordHash)
        # Returning if the authToken is unsuccessful
        if not user:
            return jsonify(success=False)
        # Returning the authToken is successful
        return jsonify(success=True, authToken=user.authToken, name=user.name, email=user.email, type=user.type)