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
        abort(HTTPStatus.CONFLICT, message= str(e.__dict__['orig']))
    return HTTPStatus.OK


class Hello(Resource):
    def get(self):
        return getItems()
