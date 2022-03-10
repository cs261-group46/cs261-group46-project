from app import app
from app.middleware.auth import auth_required
from app.routes.verifyemail import verifyemail
from app.routes.api import api
from os import path
from json import dumps

app.register_blueprint(api)
app.register_blueprint(verifyemail)


@app.errorhandler(404)
def index(error):
    with open(path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
        file_contents = file.read()
    return file_contents


@app.after_request
@auth_required(-1)
def after_request(response, user=None):
    if response.is_json:
        if user:
            response_json = response.get_json()
            response_json['user'] = user.id
            response.data = dumps(response_json)
    return response
