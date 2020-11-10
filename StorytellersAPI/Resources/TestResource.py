from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from http import HTTPStatus

def getItems():
    return "hello"


class Hello(Resource):
    def get(self):
        return getItems()
