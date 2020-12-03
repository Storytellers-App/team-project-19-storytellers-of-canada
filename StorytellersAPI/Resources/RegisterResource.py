from flask_restful import Resource, request, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.RegisterService import RegisterService
from hashlib import blake2b
import base64


# Class for handling login requests
class Register(Resource):

    # POST /register?name&email&username&password
    def post(self):
        # Parsing the registration parameters
        parser = reqparse.RequestParser()
        parser.add_argument("name")
        parser.add_argument("email")
        # Decoding the auth header
        authInfo = request.headers.get('Authorization')       
        decoded = str(base64.b64decode(authInfo), 'utf-8')
        username = decoded[0:decoded.find(":")]
        password = decoded[decoded.find(":")+1:]
        # Hashing the auth info
        usernameHash = blake2b(str(username).encode('utf-8')).hexdigest()
        passwordHash = blake2b(str(password).encode('utf-8')).hexdigest()
        args = parser.parse_args()
        # Checking validity of credentials
        registerService = RegisterService()
        success = registerService.register(args["name"], args["email"], usernameHash, passwordHash)
        return jsonify(success=success)