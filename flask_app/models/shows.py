from flask_app import app
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
db = "trac_schema"

class Shows:
    def __init__(self, data):
        self.id = data['id']
        self.poster = data['poster']
        self.title = data['title']
        self.type = data['type']
        self.year = data['year']
        self.runtime = data['runtime']
        self.country = data['country']
        self.released = data['released']
        self.genre = data['genre']
        self.rating = data['rating']
        self.user_rating = data['user_rating']
        self.comment = data['comment']
        self.imdbID = data['imdbID']
        self.status = data['status']
        self.season = data['season']
        self.episode = data['episode']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
    
    @classmethod
    def add_show(cls, data):
        # Grab API data from browse show page into database
        query = "INSERT INTO shows(poster, title, year, runtime, type, country, released, genre, rating, imdbID) VALUES (%(showPoster)s, %(showTitle)s, %(showYear)s, %(showRuntime)s, %(showType)s, %(showCountry)s, %(showReleased)s, %(showGenre)s, %(imdbRating)s, %(imdbID)s);"
        connectToMySQL(db).query_db(query, data)
        # Get show.id by imdbID
        query2 = "SELECT id FROM shows WHERE imdbID = %(imdbID)s"
        id = connectToMySQL(db).query_db(query2, data)[0]["id"]
        # Build connection between current user and the show
        query3 = "INSERT IGNORE INTO stored_shows(show_id, user_id, status) VALUES((SELECT id FROM shows WHERE imdbID = %(imdbID)s), %(user_id)s, %(submit_button)s)"
        connectToMySQL(db).query_db(query3, data)
        # To prevent show existed, and status cannot be insert
        query4 = "UPDATE stored_shows SET status = %(submit_button)s WHERE show_id= (SELECT id FROM shows WHERE imdbID = %(imdbID)s) and user_id = %(user_id)s;"
        connectToMySQL(db).query_db(query4, data)
        return id

    @classmethod
    def get_all_shows(cls, status, user_id):
        # Get all info of the show by status and user_id
        query = f"SELECT * FROM stored_shows LEFT JOIN shows ON shows.id = stored_shows.show_id WHERE status = '{status}' and stored_shows.user_id = {user_id} ORDER BY stored_shows.updated_at DESC;"
        results = connectToMySQL(db).query_db(query)
        shows = []
        for row in results:
            shows.append(cls(row))
        return shows

    @classmethod
    def get_ten_lastest_shows(cls, status, user_id):
        # Get all info of the show by status and user_id
        query = f"SELECT * FROM stored_shows LEFT JOIN shows ON shows.id = stored_shows.show_id WHERE status = '{status}' and stored_shows.user_id = {user_id} ORDER BY stored_shows.updated_at DESC LIMIT 9;"
        results = connectToMySQL(db).query_db(query)
        shows = []
        for row in results:
            shows.append(cls(row))
        return shows

    @classmethod
    def move_show_to_other_status_by_id(cls, action, id, user_id):
        if action == "remove":
            query = f"DELETE FROM stored_shows WHERE show_id = '{id}' and user_id = {user_id};"
        else:
            query = f"UPDATE stored_shows SET status = '{action}' WHERE show_id = {id} and user_id = {user_id};"
        return connectToMySQL(db).query_db(query)

    @classmethod
    def add_movie_to_watching(cls, action, id, user_id):
        query = f"UPDATE stored_shows SET status = '{action}' WHERE show_id = {id} and user_id = {user_id};"
        return connectToMySQL(db).query_db(query)

    @classmethod
    def add_progress_to_watching(cls, action, id, season, episode, user_id):
        query = f"UPDATE stored_shows SET status = '{action}', season = {season} , episode = {episode} WHERE show_id = {id} and user_id = {user_id};"
        return connectToMySQL(db).query_db(query)

    @classmethod
    def add_comment_to_watched_show(cls, action, id, user_rating, comment, user_id):
        # change show_status to watched, and add user_rating and comment to it
        query = f"UPDATE stored_shows SET status = '{action}', user_rating = {user_rating} , comment = '{comment}' WHERE show_id = {id} and user_id = {user_id};"
        return connectToMySQL(db).query_db(query)

    @classmethod
    def show_count(cls, user_id):
        count = []
        query1 = f"SELECT COUNT(shows.id) AS count FROM shows LEFT JOIN stored_shows ON stored_shows.show_id = shows.id WHERE status = 'Want' and user_id = {user_id};"
        count.append(connectToMySQL(db).query_db(query1)[0])
        query2 = f"SELECT COUNT(shows.id) AS count FROM shows LEFT JOIN stored_shows ON stored_shows.show_id = shows.id WHERE status = 'Watching' and user_id = {user_id};"
        count.append(connectToMySQL(db).query_db(query2)[0])
        query3 = f"SELECT COUNT(shows.id) AS count FROM shows LEFT JOIN stored_shows ON stored_shows.show_id = shows.id WHERE status = 'Watched' and user_id = {user_id};"
        count.append(connectToMySQL(db).query_db(query3)[0])
        return count

    @classmethod
    def get_show_by_id(cls, show_id, user_id):
        info_page_list = []
        query = f"SELECT * FROM shows LEFT JOIN stored_shows ON stored_shows.show_id = shows.id LEFT JOIN users ON stored_shows.user_id = users.id WHERE shows.id = {show_id} and users.id = {user_id};"
        result = connectToMySQL(db).query_db(query)[0]
        info_page_list.append(result)
        query2 = f"SELECT * FROM stored_shows LEFT JOIN users ON stored_shows.user_id = users.id WHERE show_id = {show_id};"
        result2 = connectToMySQL(db).query_db(query2)
        # print("***********************", result2)
        info_page_list.append(result2)
        return (info_page_list)



