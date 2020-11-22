# Add, edit, delete stories
# files should be transcoded to mp3 128kb
# https://stackoverflow.com/questions/42809096/difference-in-boto3-between-resource-client-and-session
import boto3
import botocore.exceptions
from pathlib import Path
from botocore.errorfactory import ClientError
from Services.instance.config import *


class S3StoryService:
    """
    This class deals with s3 + buckets
    """

    def __init__(self):
        # mock bucket for now
        self.s3 = boto3.client('s3', endpoint_url='http://192.168.2.31:4567',
                               aws_access_key_id='123', aws_secret_access_key='abc')

        # List all buckets on your account.
        # response = client.list_buckets()
        # spaces = [space['Name'] for space in response['Buckets']]
        # print("Spaces List: %s" % spaces)

        self.s3.create_bucket(Bucket='my_bucket')
        # for bucket in self.s3.buckets.all():
        #     print(bucket.name)

    # https://stackoverflow.com/questions/26871884/how-can-i-easily-determine-if-a-boto-3-s3-bucket-resource-exists
    def check_bucket(self, bucket_name):
        """
        Check if bucket exists
        :param bucket_name: name of bucket to check
        :return: True if exists, False otherwise
        """
        try:
            self.s3.head_bucket(Bucket=bucket_name)
            print("Bucket Exists!")
            return True
        except botocore.exceptions.ClientError as e:
            # If a client error is thrown, then check that it was a 404 error.
            # If it was a 404 error, then the bucket does not exist.
            error_code = int(e.response['Error']['Code'])
            if error_code == 403:
                print("Private Bucket. Forbidden Access!")
                return True
            elif error_code == 404:
                print("Bucket Does Not Exist!")
                return False

    def create_bucket(self, bucket_name):
        """
        Creates a bucket.
        :param bucket_name:
        :return:
        """
        try:
            self.s3.create_bucket(Bucket=bucket_name)
            return True
        except:
            return False

    def check_key(self, bucket_name, key_name):
        """
        Checks if a specific bucket has a specific key
        :param bucket_name: bucket name (checks if it exists as well)
        :param key_name: key to check on that specific bucket
        :return: True if exists, false if bucket doesn't exist or key doesn't exist
        """
        if not self.check_bucket(bucket_name):
            return False

        try:
            self.s3.head_object(Bucket=bucket_name, Key=key_name)
            return True
        except ClientError:
            return False

    def get_url_from_key(self, bucket, key):
        if not self.check_key(bucket, key):
            return None

        try:
            # URL expires in 200 years
            return self.s3.generate_presigned_url('get_object', Params={'Bucket': bucket, 'Key': key},
                                                  ExpiresIn=6307200000, HttpMethod="GET")
        except:
            return None

    # https://stackoverflow.com/questions/26871884/how-can-i-easily-determine-if-a-boto-3-s3-bucket-resource-exists
    def upload_file(self, file_name, bucket_name, key):
        """
        Uploads a local file to the specified bucket with a specified key
        :param file_name: path to local file
        :param bucket_name: name of the bucket to upload to
        :param key: name of the key to upload to
        :return:
        """
        if not self.check_bucket(bucket_name):
            self.create_bucket(bucket_name)
        try:
            self.s3.upload_file(file_name, bucket_name, key)
            self.s3.put_object_acl(ACL='public-read', Bucket=bucket_name, Key=key)
            return True
        except:
            return False

    def upload_fileobj(self, fileobj, bucket_name, key):
        """
        Uploads a file-like object to the specified bucket with a specified key
        :param fileobj: A file-like object, eg. a file created using open()
        :param bucket_name: the bucket name
        :param key: the key to assign the object to
        :return:
        """
        if not self.check_bucket(bucket_name):
            self.create_bucket(bucket_name)
        try:
            self.s3.upload_fileobj(fileobj, bucket_name, key)
            self.s3.put_object_acl(ACL='public-read', Bucket=bucket_name, Key=key)
            return True
        except:
            return False


if __name__ == "__main__":
    client = S3StoryService()
    path = Path("../SongFiles/4.35-How Heart Came Into The World - Dan Yashinsky.mp3").resolve()
    client.upload_file(str(path), "my_bucket", "How Heart Came Into The World - Dan Yashinsky.mp3")
    session = boto3.Session()
    s3 = session.client('s3', endpoint_url='http://192.168.2.31:4567', aws_access_key_id='123',
                        aws_secret_access_key='abc')
    url = s3.generate_presigned_url('get_object', Params={'Bucket': 'my_bucket',
                                                          'Key': "How Heart Came Into The World - Dan Yashinsky.mp3"},
                                    HttpMethod="GET")
    print(url)
