# Browse/read Stories
# https://www.boynux.com/live-stream-music-from-s3
# https://flask-restful.readthedocs.io/en/latest/reqparse.html
from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from http import HTTPStatus
from Services.S3StoryService import S3StoryService
import boto3


class StoryFetchResource(Resource):
    def __init__(self):
        self.s3_client = S3StoryService()

    def get(self):
        """
        Gets url from file name.
        For now we are assuming all songs are in the same bucket.
        """
        parser = reqparse.RequestParser()
        parser.add_argument('file_name', required=True, help="File name cannot be blank!")
        args = parser.parse_args()
        url = self.s3_client.get_url_from_key("my_bucket", args.file_name)
        if url is None:
            # TODO: is this the correct way to handle errors in Resources?
            abort(404, description="Key {} not found.".format(args.file_name))

        return jsonify(url=args.url)
