from uuid import uuid4

import app.utils as Utils
import app.environ as environ
import app.sql as SQL


def register(db, email: str, password: str, password_repeat: str, first_name: str, last_name: str, department) -> tuple:

    if not SQL.is_valid_input(email):
        return False, "SQL.invalid", 1
    if not SQL.is_valid_input(first_name):
        return False, "SQL.invalid", 4
    if not SQL.is_valid_input(last_name):
        return False, "SQL.invalid", 5

    if not Utils.is_password_allowed(password, password_repeat):
        return False, "Password.invalid", 2
    if GetBy.email(db, email).isLoaded():
        return False, "Email.duplicate", 1

    departmentData: Departments.Department = Departments.GetBy.exists(db, department)
    if departmentData is None:
        print(department)
        return False, "Department.invalid", 6

    user_salt = Utils.random_string(16)
    hashed_password = Utils.hash_password(password, first_name + " " + last_name, user_salt, environ.get("PEPER"))
    id = get_available_random_uuid(db)  # Still need to verify unocupied
    statement = f"INSERT INTO USERS(unique_user_id, email, hashedPassword, salt, firstName, lastName, departmentId) " \
                f"VALUES ('{id}', '{email}', '{hashed_password}', '{user_salt}', '{first_name}', '{last_name}', {departmentData.id});"
    cursor = db.cursor()
    cursor.execute(statement)

    valid, user, login_token = login(db, email, password)
    user.send_verify_email(db)
    return valid, user, login_token


def login(db, email: str, password: str) -> tuple:
    if not SQL.is_valid_input(email):
        return False, "SQL.invalid", 1

    user = GetBy.email(db, email)
    if user is False:
        return False, "User.EmailNotRegistered", 1

    if not Utils.check_password(user.first_name + " " + user.last_name, user.salt, environ.get("PEPER"), password, user.hashed_password):
        return False, "Password.Wrong", 2

    login_token = Token.generate(db, user, "LOGIN")
    #statement = f"INSERT INTO USER_LOGIN_TOKENS(userID, token) VALUES ({user.id}, '{login_token}');"
    #cursor = db.cursor()
    #cursor.execute(statement)
    return True, user, login_token


def logout(db, login_token: str):
    user = GetBy.login_token(db, login_token)
    if user.isDummy():
        return False

    print(f"Logging out {repr(user)}")
    Token(userID=user.id, tokenValue=login_token, tokenType="LOGIN").delete(db)
    # cursor = db.cursor()
    # cursor.execute(f"DELETE FROM USER_LOGIN_TOKENS WHERE token='{login_token}';")
    return True


def get_available_random_uuid(db):
    while True:
        id = uuid4()
        if GetBy.uuid(db, id).isDummy():
            break
    return id

from app.user import GetBy
from app.models import Token, Departments