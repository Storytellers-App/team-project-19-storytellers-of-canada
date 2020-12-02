from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from extensions import db
from models import VerificationCode
from sqlalchemy.exc import *
import sqlalchemy

# Class for handling registration


class EmailVerificationService:

    def validate(self, emailInput, validationTokenInput):
        try:
            code = VerificationCode.query.filter_by(email=emailInput).first()

            return code.code == validationTokenInput
        except Exception as e:
            print(e)
            return False
