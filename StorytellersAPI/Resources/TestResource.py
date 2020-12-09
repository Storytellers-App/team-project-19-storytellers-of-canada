from flask import jsonify
from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus
from extensions import db
from models import User
from sqlalchemy.exc import *


def getItems():
    # Example on how to call sql alchemy
    user = User(username='aidan', password='test', name='Aidan Brasseur', email='test@test.com', authToken='testToken')
    db.session.add(user)
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        abort(HTTPStatus.CONFLICT, message=str(e.__dict__['orig']))
    return HTTPStatus.OK


def health_database_status():
    is_database_working = True
    output = 'database is ok'

    try:
        # to check database we will execute raw query
        db.session.execute('SELECT 1')
    except Exception as e:
        output = str(e)
        is_database_working = False

    return jsonify(success=is_database_working, log=output)


class TestDB(Resource):
    def get(self):
        return health_database_status()
