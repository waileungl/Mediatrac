from math import floor
from flask_app import app
from flask_app.config.mysqlconnection import connectToMySQL
from flask_bcrypt import Bcrypt        
bcrypt = Bcrypt(app)  
from flask import flash
import re
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$') 
db = "trac_schema"

class Users:
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.email = data['email']
        self.hash = data['hash']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @staticmethod
    def validate_registration(input):
        is_valid = True
        if len(input['name']) < 2:
            flash("User name must be at least 2 characters.", "registration")
            is_valid = False
        if not EMAIL_REGEX.match(input['email']): 
            flash("Invalid email address!", "registration")
            is_valid = False
        user_email = {
            "email":input['email']
        }
        query = "SELECT * FROM users WHERE email = %(email)s;"
        all_email = connectToMySQL(db).query_db(query, user_email)
        if len(all_email):
            flash("Email address is already existed!", "registration")
            is_valid = False
        if len(input['password']) < 8:
            flash("Password must be at least 8 characters.", "registration")
            is_valid = False
        char_check = 0
        for char in input['password']:
            if char.isupper():
                char_check += 1
            if char.isdigit():
                char_check += 1000
        if char_check % 1000 < 1 or floor(char_check / 1000) < 1:
            flash("Password is required to contain at least one capital letter and one number!", "registration")
            is_valid = False
        if input['password'] != input['confirm_password']:
            flash("Password is not identical!", "registration")
            is_valid = False
        return is_valid

    @classmethod
    def register(cls, data):
        query = "INSERT INTO users(name, email, hash, created_at, updated_at) VALUES(%(name)s, %(email)s, %(password)s, now(), now());"
        return connectToMySQL(db).query_db(query, data)

    @classmethod
    def validate_login(cls, data):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        result = connectToMySQL(db).query_db(query,data)
        if len(result) < 1:
            return False
        return cls(result[0])

    @classmethod
    def get_user_by_id(cls, data):
        query = "SELECT * FROM users WHERE id = %(id)s;"
        result = connectToMySQL(db).query_db(query, data)
        return cls(result[0])

