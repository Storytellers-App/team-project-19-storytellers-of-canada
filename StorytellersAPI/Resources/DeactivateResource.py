from flask_restful import Resource, reqparse, request, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from models import User
from Services.GetUserService import GetUserService
from extensions import db
from hashlib import blake2b
import base64

class Deactivate(Resource):

    # POST /updateName?name
    def post(self):
        # Getting the user's auth token
        authInfo = request.headers.get('Authorization')
        decoded = str(base64.b64decode(authInfo), 'utf-8')
        # Parsing the auth info
        authToken = decoded[0:decoded.find(":")]
        passwordInfo = decoded[decoded.find(":")+1:]
        # Deactivating the account
        try:
            user_service = GetUserService()
            temp_user = user_service.getUserWithAuthToken(authToken)
            # Checking if the current password is correct
            hashedPassword = blake2b(str(passwordInfo).encode('utf-8')).hexdigest()
            if (hashedPassword == temp_user.password):
                # Deactivating the account
                temp_user.isActive = False
                db.session.commit()  
                return jsonify(success=True)
            else:
                return jsonify(success=False)         
        except Exception as e:
            return jsonify(success=False)