from uuid import uuid4
from app.validators.LoginValidator import validator as login_validator
from app.validators.RegisterValidator import validator as register_validator
import app.utils as Utils
import app.environ as environ

import app.sql as SQL
from app.models import Token, Departments, Users


def register(db, email: str, password: str, password_repeat: str, first_name: str, last_name: str, department) -> tuple:

    register_validator.validate({"email": email, "password": password, "password_repeat": password_repeat, "first_name": first_name, "last_name": last_name})
    print(register_validator.errors)

    if not SQL.is_valid_input(email):
        return False, "SQL.invalid", 1
    if not SQL.is_valid_input(first_name):
        return False, "SQL.invalid", 4
    if not SQL.is_valid_input(last_name):
        return False, "SQL.invalid", 5

    if not Utils.is_password_allowed(password, password_repeat):
        return False, "Password.invalid", 2
    if not Users.query.select(email=email).is_empty():
    #if Users.GetBy.email(db, email).isLoaded():
        return False, "Email.duplicate", 1

    department_data: Departments.Department = Departments.GetBy.exists(db, department)
    if department_data is None:
        print(department)
        return False, "Department.invalid", 6

    user_salt = Utils.random_string(16)
    hashed_password = Utils.hash_password(password, first_name + " " + last_name, user_salt, environ.get("PEPER"))
    id = get_available_random_uuid(db)  # Still need to verify unoccupied
    statement = f"INSERT INTO USERS(unique_user_id, email, hashedPassword, salt, firstName, lastName, departmentId) " \
                f"VALUES ('{id}', '{email}', '{hashed_password}', '{user_salt}', '{first_name}', '{last_name}', {department_data.id});"
    cursor = db.cursor()
    cursor.execute(statement)

    valid, user, login_token = login(db, email, password)
    user.send_verify_email(db)
    return valid, user, login_token


def login(db, email: str, password: str) -> tuple:
    if not SQL.is_valid_input(email):
        return False, "SQL.invalid", 1

    user = Users.query.select(email=email).first()
    if user is None:
        return False, "User.EmailNotRegistered", 1

    if not Utils.check_password(user.firstName + " " + user.lastName, user.salt, environ.get("PEPER"), password, user.hashed_password):
        return False, "Password.Wrong", 2

    login_token = Token.generate(db, user, "LOGIN")
    #statement = f"INSERT INTO USER_LOGIN_TOKENS(userID, token) VALUES ({user.id}, '{login_token}');"
    #cursor = db.cursor()
    #cursor.execute(statement)
    return True, user, login_token


def logout(db, login_token: str):
    user = Users.query.select(login_token=login_token).first()
    if user is None:
        return False

    print(f"Logging out {repr(user)}")
    Token(userID=user.id, tokenValue=login_token, tokenType="LOGIN").delete(db)
    # cursor = db.cursor()
    # cursor.execute(f"DELETE FROM USER_LOGIN_TOKENS WHERE token='{login_token}';")
    return True


def get_available_random_uuid(db):
    while True:
        id = uuid4()
        if Users.query.select(uuid=id).is_empty():  #   .GetBy.uuid(db, id).isDummy():
            break
    return id



