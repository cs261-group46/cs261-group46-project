from app import app
from app.routes.verifyemail import verifyemail
from app.routes.api import api
from os import path

app.register_blueprint(api)
app.register_blueprint(verifyemail)


@app.errorhandler(404)
def index(error):
    with open(path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
        file_contents = file.read()
    return file_contents