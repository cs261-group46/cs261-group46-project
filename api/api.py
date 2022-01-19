import time
from flask import Flask

app = Flask(__name__)

@app.route("/api/helloworld")
def get_current_time():
    return {"helloworld" : "This is working"}