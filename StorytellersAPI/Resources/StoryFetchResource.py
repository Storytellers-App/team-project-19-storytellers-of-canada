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
        Required args:
        key: Name of the file to get the url of
        bucket: Name of the bucket in which file_name is in.
        """
        parser = reqparse.RequestParser()
        parser.add_argument('key', required=True, help="File name cannot be blank!")
        parser.add_argument('bucket', required=True, help="Bucket name cannot be blank!")
        args = parser.parse_args()
        if not self.s3_client.check_bucket(args.bucket):
            return abort(404, description="Bucket {} not found.".format(args.bucket))
        url = self.s3_client.get_url_from_key(args.bucket, args.key)
        if url is None:
            # TODO: is this the correct way to handle errors in Resources?
            return abort(404, description="Key {} not found.".format(args.key))

        return jsonify(url=args.url)
