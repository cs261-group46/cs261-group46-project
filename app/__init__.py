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

from flask import Flask, request, session, redirect, url_for, send_file
import os

import app.environ as environ

import app.filemanager as FileManager
import app.config as Config
import app.sql as sql
from app.email import EMail as Mail, register as MailRegister

##########################
# Config Options/Loading #
##########################

login_token_key_str = "login_token"

# ALL THE FOLLOWING HAS WORKED FOR SEVERAL WEEKS, DON'T BREAK IT

sql_config   = Config.load_config("sql")
email_config = Config.load_config("email")

db = sql.open_connection(sql_config["connection"])
sql.launch(db, reset=False)

##################
# Import Modules #
##################


import app.models as Models
import app.user as Users


peper = environ.get('PEPER')
name = environ.get('NAME')

##########################
# Config Options/Loading #
##########################



#############
# App setup #
#############

app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")
app.config["SECRET_KEY"] = environ.get('SECRET_KEY')

if email_config["enabled"]:
    for key, value in email_config["email_server"].items():
        app.config[f"MAIL_{key.upper()}"] = value

Mail.main(email_config["enabled"], app, email_config["sender"])
Mail.debug = True

###############
# Route setup #
###############





from app.routes import load_routes

load_routes(app)



