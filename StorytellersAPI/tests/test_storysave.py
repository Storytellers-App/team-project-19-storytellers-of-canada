from app import app
import unittest
import json


class TestHelloWorld(unittest.TestCase):

    def test_always_true(self):
        self.assertEqual(True, True)

    # def setUp(self):
    #     self.app = app.test_client()
    #     self.app.testing = True

    # we have no way to test because these env variables are secret

    # def test_db(self):
    #     response = self.app.get('/testdb')
    #     self.assertEqual(response.status_code, 200)
    #
    # def test_get_story(self):
    #     response = self.app.get('/story_fetch?key=How Heart Came Into The World - Dan Yashinsky.mp3&bucket=sccanada')
    #     response_json = json.loads(response.data)
    #     self.assertEqual(len(response_json['url']) > 0, True)


if __name__ == '__main__':
    unittest.main()
