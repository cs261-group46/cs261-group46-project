###################################
# CS261 Group Project - Group 46  #
#                                 #
# 19/01/2022 - XX/XX/XXXX         #
# Version: 0.1                    #
#                                 #
# Pip install:                    #
#   flask                         #
#   flask-mail                    #
#   flask-wtf                     #
#   flask_sqlalchemy              #
#   passlib                       #
#   psycopg2                      #
#   gunicorn                      #
###################################

###########
# Imports #
###########
import json
import time

from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy, inspect
from flask_marshmallow import Marshmallow

#############
# App setup #
#############

app = Flask(__name__)
config = "config.dev.json" if app.config['ENV'] == "development" else "config.prod.json"
app.config.from_file(config, load=json.load)

db = SQLAlchemy(app)
mail = Mail(app)
ma = Marshmallow(app)

# retry logic
retries = 20
while retries > 0:
    try:
        db.session.query("1").from_statement("SELECT 1").all()
        break
    except:
        retries = retries - 1
        time.sleep(1)

if not inspect(db.get_engine()).get_table_names():
    from api.factories.reset import reset
    reset()


import api.routes
