from flask_app import app
from flask import render_template,redirect,request, session, flash
from flask_app.models.shows import Shows

@app.route('/browse_shows')
def browse_show():
    if 'id' not in session:
        return redirect('/')
    return render_template("browse_show.html")

@app.route('/add_show', methods = ['POST'])
def add_show():
    user_id = session["id"]
    data = {
        "showPoster": request.form["showPoster"],
        "showTitle": request.form["showTitle"],
        "showType": request.form["showType"],
        "showYear": request.form["showYear"],
        "showRuntime": request.form["showRuntime"],
        "showCountry": request.form["showCountry"],
        "showReleased": request.form["showReleased"],
        "showGenre": request.form["showGenre"],
        "imdbRating": request.form["imdbRating"],
        "imdbID": request.form["imdbID"],
        "user_id": user_id,
        "submit_button": request.form["submit_button"]
    }
    show_id = Shows.add_show(data)
    if request.form['submit_button'] == 'Want':
        return redirect("/show/Want")
    if request.form['submit_button'] == 'Watching':
        season = request.form["season"]
        episode = request.form["episode"]
        action = request.form["submit_button"]
        Shows.add_progress_to_watching(action, show_id, season, episode, user_id)
        return redirect("/show/Watching")
    if request.form['submit_button'] == 'Watched':
        user_rating = request.form["user_rating"]
        comment = request.form["comment"]
        action = request.form["submit_button"]
        Shows.add_comment_to_watched_show(action, show_id, user_rating, comment, user_id)
        return redirect("/show/Watched")

@app.route('/show/<status>')
def to_user_show_library_by_status(status):
    if 'id' not in session:
        return redirect('/')
    user_id = session["id"]
    if status == "Want": 
        return render_template("to_watch.html", to_watch_shows = Shows.get_all_shows(status, user_id), show_count = Shows.show_count(user_id))
    if status == "Watching": 
        return render_template("watching.html", watching_shows = Shows.get_all_shows(status, user_id), show_count = Shows.show_count(user_id))
    if status == "Watched": 
        return render_template("watched.html", watched_shows = Shows.get_all_shows(status, user_id), show_count = Shows.show_count(user_id)) 

@app.route('/move_show_to_other_status/<action>/<status>/<id>', methods = ['POST'])
def move_show_to_other_status_by_id(action, status, id):
    user_id = session["id"]
    if action == "remove":
        Shows.move_show_to_other_status_by_id(action, id, user_id)
        return redirect(f'/show/{status}')
    if action == "Want":
        Shows.move_show_to_other_status_by_id(action, id, user_id)
        return redirect(f'/show/{status}')
    if action == "Watching":
        season = request.form["season"]
        episode = request.form["episode"]
        Shows.add_progress_to_watching(action, id, season, episode, user_id)
        return redirect(f'/show/{status}')
    if action == "Watched":
        user_rating = request.form["user_rating"]
        comment = request.form["comment"]
        Shows.add_comment_to_watched_show(action, id, user_rating, comment, user_id)
        return redirect(f'/show/{action}')

@app.route('/move_movie_to_watching/<action>/<status>/<id>')
def move_movie_to_watching(action, status, id):
    if 'id' not in session:
        return redirect('/')
    user_id = session["id"]
    Shows.add_movie_to_watching(action, id, user_id)
    return redirect(f'/show/{action}')

@app.route('/show/favourate')
def move_to_fav_page():
    if 'id' not in session:
        return redirect('/')
    user_id = session["id"]
    return render_template('favourate.html', watched_shows = Shows.get_all_shows("Watched", user_id), show_count = Shows.show_count(user_id))


@app.route('/show/selected/<show_id>')
def get_show_by_id(show_id):
    if 'id' not in session:
        return redirect('/')
    user_id = session["id"]
    return render_template('show_content.html', info = Shows.get_show_by_id(show_id, user_id))
