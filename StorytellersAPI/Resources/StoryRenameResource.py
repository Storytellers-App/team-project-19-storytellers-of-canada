from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from flask import jsonify
from flask import Response
from http import HTTPStatus
from Services.S3StoryService import S3StoryService
import werkzeug.datastructures


class StoryRename(Resource):
    def __init__(self):
        self.s3_client = S3StoryService()

    def patch(self):
        """
        Rename a file. If new_bucket does not exist, it will create it.
        Required args:
        old_key: the key of the file to rename.
        new_key: the new key for the file.
        old_bucket: the bucket of the key to rename.
        new_bucket: the bucket for the new key
        """
        parser = reqparse.RequestParser()
        parser.add_argument('old_key', required=True, help="Key of file to rename - old_key - cannot be blank")
        parser.add_argument('old_bucket', required=True, help="Bucket of key to rename - old_bucket - cannot be blank")
        parser.add_argument('new_key', required=True, help="New key for file - new_key - cannot be blank")
        parser.add_argument('new_bucket', required=True, help="Bucket to move to - new_bucket - cannot be blank")
        args = parser.parse_args()

        # check if key is valid
        if not self.s3_client.check_key(args.old_bucket, args.old_key):
            # key is invalid
            return abort(404, description="Key {} not found.".format(args.key))

        # check if old_bucket is valid:
        if not self.s3_client.check_bucket(args.old_bucket):
            return abort(404, description="Old bucket {} not found.".format(args.old_bucket))

        # check if new_bucket exists:
        if not self.s3_client.check_bucket(args.new_bucket):
            # create new_bucket
            self.s3_client.create_bucket(args.new_bucket)

        copy_source = {
            'Bucket': args.old_bucket,
            'Key': args.old_key
        }
        self.s3_client.s3.copy_object(Bucket=args.new_bucket, CopySource=copy_source, Key=args.new_key)
        self.s3_client.s3.delete_object(Bucket=args.old_bucket, Key=args.old_key)
        # Status code 200 requires a body, but status code 204 does not
        return Response(status=204)
