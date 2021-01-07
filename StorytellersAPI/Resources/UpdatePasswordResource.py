from flask_restful import Resource, reqparse, request, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from models import User
from Services.GetUserService import GetUserService
from Services.UpdatePasswordService import UpdatePasswordService
from extensions import db
from hashlib import blake2b
import base64

class UpdatePassword(Resource):

    # POST /updateName?name
    def post(self):
        # Getting the user's auth token
        authInfo = request.headers.get('Authorization')
        decoded = str(base64.b64decode(authInfo), 'utf-8')
        # Parsing the auth info
        authToken = decoded[0:decoded.find(":")]
        passwordInfo = decoded[decoded.find(":")+1:]
        currentPassword = passwordInfo[0:passwordInfo.find(":")]
        newPassword = passwordInfo[passwordInfo.find(":")+1:]
        # Updating the user's name
        try:
            user_service = GetUserService()
            temp_user = user_service.getUserWithAuthToken(authToken)
            # Checking if the current password is correct
            hashedPassword = blake2b(str(currentPassword).encode('utf-8')).hexdigest()
            if (hashedPassword == temp_user.password):
                # Updating the password
                password_service = UpdatePasswordService()
                password_service._updatePassword(temp_user, newPassword)
                db.session.commit()            
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False)