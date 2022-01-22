from flask import Flask, request, redirect, url_for, send_file
import os
import app.ReactSpoof as ReactSpoof

app = Flask(__name__, static_url_path="/flask_static")

ReactSpoof.load_to_app(app, send_file)


@app.route('/')
def index():
    return ReactSpoof.load_index()


@app.route("/api/helloworld")
def get_current_time():
    return {"helloworld": "This is working"}


if __name__ == "__main__":
    app.run()


print(app.template_folder, app.static_folder, app.static_url_path)