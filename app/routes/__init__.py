from app import app
from app.routes.verifyemail import verifyemail
from app.routes.api import api

app.register_blueprint(api)
app.register_blueprint(verifyemail)
