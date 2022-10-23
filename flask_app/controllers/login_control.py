from flask_app import app
from flask import render_template,redirect,request, session, flash
from flask_app.models.shows import Shows
from flask_app.models.login import Users
from flask_bcrypt import Bcrypt


bcrypt = Bcrypt(app)

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/register', methods = ['POST'])
def register():
    if not Users.validate_registration(request.form):
        return redirect('/')
    pw_hash = bcrypt.generate_password_hash(request.form['password'])
    data = {
        "name": request.form['name'],
        "email": request.form['email'],
        "password": pw_hash
    }
    session["id"] = Users.register(data)
    session["user_name"] = request.form['name']
    return redirect('/home')

@app.route('/login', methods = ['POST'])
def login():
    data = {
        "email": request.form['login_email']
    }
    user = Users.validate_login(data)
    if not user:
        flash("Invalid Email/Password", "login")
        return redirect('/')
    if not bcrypt.check_password_hash(user.hash, request.form['login_password']):
        flash("Invalid Email/Password", "login")
        return redirect('/')
    session["id"] = user.id
    session["user_name"] = user.name
    return redirect("/home")

@app.route('/home')
def profile():
    if 'id' not in session:
        return redirect('/')
    user_id = session["id"]
    return render_template('index.html',nine_watching_shows = Shows.get_nine_lastest_shows("Watching", user_id), nine_to_watch_shows = Shows.get_nine_lastest_shows("Want", user_id))


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')