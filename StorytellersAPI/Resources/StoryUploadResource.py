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
    # TODO: need to clean key argument to prevent any attacks (secure filename)
    # also need to keep track of these additions in a separate SQL database
    # https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/
    # put because client specifies key
    def put(self):
        """
        Uploads a file with a given key. If bucket given doesn't exist, it creates it.
        Required args:
        key: Key for the new file to be uploaded.
        file: File to be uploaded.
        bucket: Bucket of file to be placed into
        """
        parser = reqparse.RequestParser()
        parser.add_argument('key', required=True, help="Key cannot be blank!")
        parser.add_argument('file', required=True, type=werkzeug.datastructures.FileStorage, location='files',
                            help="No file uploaded")
        parser.add_argument('bucket', required=True, help="Bucket name cannot be blank!")
        args = parser.parse_args()

        # check if bucket exists
        if not self.s3_client.check_bucket(args.bucket):
            # create bucket
            self.s3_client.create_bucket(args.bucket)

        # check if key exists
        # note: return aborts
        if self.s3_client.check_key(args.bucket, args.key):
            return abort(409, description="Key {} already exists".format(args.key))

        ret_val = self.s3_client.upload_fileobj(args.file, args.bucket, args.key)
        if not ret_val:
            return abort(500, description="Error in upload_fileobj")
        else:
            return Response(status=201)
