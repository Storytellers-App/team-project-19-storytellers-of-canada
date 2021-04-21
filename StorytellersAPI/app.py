from flask import Flask, send_from_directory
from flask_restful import Api
from Resources.TestResource import TestDB
from config import Config
from extensions import db
import logging

from Resources.LoginResource import Login
from Resources.RegisterResource import Register
from Resources.StoriesResource import Stories, Responses
from Resources.LikesResource import AddLikes, RemoveLikes
from Resources.AdminResource import Admin
from Resources.CommentResource import CommentRes
from Resources.EmailVerificationResource import EmailVerification

from Resources.EmailVerificationWithUsername import EmailVerificationWithUsername
from Resources.SendForgotPasswordEmailResource import SendForgotPasswordEmailResource
from Resources.ResetForgotPasswordResource import ResetForgotPasswordResource

from Resources.UpdateNameResource import UpdateName
from Resources.UpdateEmailResource import UpdateEmail
from Resources.UpdatePasswordResource import UpdatePassword
from Resources.UpdateImageResource import UpdateImage
from Resources.PromoteUserResource import PromoteUser
from Resources.DeactivateResource import Deactivate
from Resources.BlockResource import BlockUser
from Resources.BlockResource import UnBlockUser
from Resources.AuthTokenLoginResource import AuthTokenLogin
from Resources.GDPRResource import GDPRResource


# test database
from Resources.TestResource import TestDB

app = Flask(__name__, static_folder="../gdprportal/build/static")
app.config.from_object(Config)
api = Api(app)
db.init_app(app)


@app.route('/gdprportal/<path:path>')
def send_js(path):
    return send_from_directory('../gdprportal/build', path)


# gunicorn logging
gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.DEBUG)

# GET /testdb
api.add_resource(TestDB, '/testdb')

# GET /login?username&password
api.add_resource(Login, '/login')

# GET /authTokenLogin
api.add_resource(AuthTokenLogin, '/authTokenLogin')

# POST /register?name&email&username&password
api.add_resource(Register, '/register')
api.add_resource(Stories, '/stories')
api.add_resource(Responses, '/stories/responses')
api.add_resource(AddLikes, '/stories/addlike')
api.add_resource(RemoveLikes, '/stories/removelike')
api.add_resource(Admin, '/admin')
api.add_resource(CommentRes, '/comment')
api.add_resource(EmailVerification, '/emailVerification')
api.add_resource(EmailVerificationWithUsername,
                 '/emailVerification/noUsername')
api.add_resource(SendForgotPasswordEmailResource, '/sendForgotPasswordEmail')
api.add_resource(ResetForgotPasswordResource, '/resetForgotPassword')
api.add_resource(GDPRResource, '/gdpr')

# Update user info resources
api.add_resource(UpdateName, '/updateName')
api.add_resource(UpdateEmail, '/updateEmail')
api.add_resource(UpdatePassword, '/updatePassword')
api.add_resource(UpdateImage, '/updateImage')

# Promote user to Admin
api.add_resource(PromoteUser, '/promoteUser')

# POST /deactivate
api.add_resource(Deactivate, '/deactivate')

# POST /block
api.add_resource(BlockUser, '/block')

# POST /unblock
api.add_resource(UnBlockUser, '/unblock')

if __name__ == '__main__':
    # host = ''  # ip host address
    # app.run(host=host)
    app.run(host='0.0.0.0')
