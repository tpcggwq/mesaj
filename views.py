from flask import Blueprint, render_template

views = Blueprint(__name__, "views")

@views.route("/")
def home():
    return render_template("index.html", name="Dora Dörtler", age=16)

@views.route("/profile/<username>")
def profile(username):
    return render_template("index_html", name=username)