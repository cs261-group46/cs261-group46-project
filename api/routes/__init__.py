from api.app import app
from api.middleware.auth import auth_required
from api.routes.verifyemail import verifyemail
from api.routes.api import api
from json import dumps

app.register_blueprint(api)
app.register_blueprint(verifyemail)

@app.route("/")
def index():
    return app.send_static_file('index.html')


@app.after_request
@auth_required(-1)
def after_request(response, user=None):
    if response.is_json:
        if user:
            response_json = response.get_json()
            response_json['user'] = user.id
            response.data = dumps(response_json)
    return response
