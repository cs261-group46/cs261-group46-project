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
#   passlib                       #
#   psycopg2                      #
#   gunicorn                      #
###################################

###########
# Imports #
###########
import json
from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy

##########################
# Config Options/Loading #
##########################

#############
# App setup #
#############

app = Flask(__name__, static_folder="../build/static/",
            static_url_path="/static")
app.config.from_file("config.json", load=json.load)

db = SQLAlchemy(app)
mail = Mail(app)

from app.models import *
from app.routes import *
