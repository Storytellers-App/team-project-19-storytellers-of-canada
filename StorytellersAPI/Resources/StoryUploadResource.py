# Upload stories
# https://www.boynux.com/live-stream-music-from-s3
from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from flask import Response
from http import HTTPStatus
from Services.S3StoryService import S3StoryService
import werkzeug.datastructures


class StoryUploadResource(Resource):
    def __init__(self):
        self.s3_client = S3StoryService()

    # TODO: are we going to handle buckets as well?
    # put because client specifies key
    def put(self):
        """
        Uploads a file with a given key
        """
        parser = reqparse.RequestParser()
        parser.add_argument('key', required=True, help="Key cannot be blank!")
        parser.add_argument('file', required=True, type=werkzeug.datastructures.FileStorage, location='files',
                            help="No file uploaded")
        args = parser.parse_args()
        if self.s3_client.check_key("my_bucket", args.key):
            abort(409, description="Key {} already exists.".format(args.key))

        ret_val = self.s3_client.upload_fileobj(args.file, "my_bucket", args.key)
        if not ret_val:
            abort(500, description="Error in upload_fileobj")
        else:
            return Response(status=201)
