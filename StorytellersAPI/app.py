from flask import Flask


app = Flask(__name__)


@app.route('/hello', methods=['GET'])
def getItems():
    return "hello"


if __name__ == '__main__':
    app.run()