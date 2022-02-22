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

#######################
# Imports | Libraries #
#######################


from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# import app.environ as environ

#################################
# Loading Environment Variables #
#################################

load_dotenv()
NAME = os.getenv("NAME")
HOST_URL = os.getenv("HOST_URL")


#####################
# Imports | Modules #
#####################

import app.config as Config
from app.email import EMail as Mail, register as MailRegister


#############
# App setup #
#############

# Create app
app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")

# Load config options
app.config["SECRET_KEY"] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{os.getenv("SQL_USER")}:{os.getenv("SQL_PASSWORD")}@{os.getenv("SQL_HOST")}:{os.getenv("SQL_PORT")}/{os.getenv("SQL_DB_NAME")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# Find email config options in config and add them (dynamic, so that end users can configure it however they want
email_config = Config.load_config("email")
if email_config["enabled"]:
    for key, value in email_config["email_server"].items():
        app.config[f"MAIL_{key.upper()}"] = value

Mail.main(email_config["enabled"], app, email_config["sender"])
Mail.debug = True

# Open database connection
db = SQLAlchemy(app)

###############
# Load Models #
###############

print("Loading Models")
from app.models import *


###############
# Load Routes #
###############

print("Loading Routes")
import app.routes as routes
# from app.routes import load_routes
#
# load_routes(app)


############
# Testting #
############

if len(Department.query.all()) == 0:
    import app.factory.departments_factory as departments_factory
