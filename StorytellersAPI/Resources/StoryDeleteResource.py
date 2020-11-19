from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from flask import Response
from http import HTTPStatus
from Services.S3StoryService import S3StoryService
import werkzeug.datastructures


class StoryDeleteResource(Resource):
    def __init__(self):
        self.s3_client = S3StoryService()

    def delete(self):
        """
        Deletes a file from the specified bucket.
        Required arguments:
        key: key of the file to remove
        bucket: bucket of the file to remove
        """
        parser = reqparse.RequestParser()
        parser.add_argument('key', required=True, help="Key cannot be blank!")
        parser.add_argument('bucket', required=True, help="Bucket name cannot be blank!")
        args = parser.parse_args()

        # check if key exists
        if not self.s3_client.check_key(args.bucket, args.key):
            # it doesn't exist
            return abort(404, description="File {} from bucket {} does not exist.".format(args.key, args.bucket))

        self.s3_client.s3.delete_object(Bucket=args.bucket, Key=args.key)
        return Response(status=200)