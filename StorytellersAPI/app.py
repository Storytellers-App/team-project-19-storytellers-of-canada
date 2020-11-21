from flask import Flask
from flask_restful import Api
from Resources.TestResource import Hello
from config import Config
from extensions import db

from Resources.LoginResource import Login
from Resources.RegisterResource import Register
from Resources.StoriesResource import Stories, Responses
from Resources.LikesResource import AddLikes, RemoveLikes

from Resources.StoryDeleteResource import StoryDelete
from Resources.StoryFetchResource import StoryFetch
from Resources.StoryRenameResource import StoryRename
from Resources.StoryUploadResource import StoryUpload


app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)
db.init_app(app)

# GET /login?username&password
api.add_resource(Login, '/login')

# POST /register?name&email&username&password
api.add_resource(Register, '/register')
api.add_resource(Stories, '/stories')
api.add_resource(Responses, '/stories/responses')
api.add_resource(AddLikes, '/stories/addlike')
api.add_resource(RemoveLikes, '/stories/removelike')
# DELETE /story_delete?key&bucket
api.add_resource(StoryDelete, '/story_delete')

# PATCH /story_rename?old_key&old_bucket&new_key&new_bucket
api.add_resource(StoryRename, '/story_rename')

# PUT /story_upload?key&bucket
# Must have file as a separate parameter
api.add_resource(StoryUpload, '/story_upload')

# GET /story_fetch?key&bucket
api.add_resource(StoryFetch, '/story_fetch')


if __name__ == '__main__':
    # host = '' # ip host address
    # app.run(host=host)
    app.run()
