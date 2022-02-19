from app.user import GetBy, uuid4
import app.environ as environ
import app.utils as Utils
from app.models import Departments
import app.SQL as SQL


def register(db, email: str, password: str, password_repeat: str, first_name: str, last_name: str, department, send_mail=True) -> tuple:
    if not SQL.is_valid_input(email, first_name, last_name, department):
        return False, "invalid argument to pass to SQL"
    if not Utils.is_password_allowed(password, password_repeat):
        return False, "invalid password"
    if GetBy.email(db, email).isLoaded():
        return False, "email already used"

    departmentData = Departments.GetBy.exists(db, department)
    if departmentData is False:
        return False, "invalid department"

    user_salt = Utils.random_string(16)
    hashed_password = Utils.hash_password(password, first_name + " " + last_name, user_salt, environ.get("PEPER"))
    id = get_available_random_uuid(db)  # Still need to verify unocupied
    statement = f"INSERT INTO USERS(unique_user_id, email, hashedPassword, salt, firstName, lastName, currentDepartment) " \
                f"VALUES ('{id}', '{email}', '{hashed_password}', '{user_salt}', '{first_name}', '{last_name}', {departmentData[0]});"
    cursor = db.cursor()
    cursor.execute(statement)
    return login(db, email, password)


def login(db, email: str, password: str) -> tuple:
    if not SQL.is_valid_input(email):
        return False, "invalid argument passed for SQL"

    user = GetBy.email(db, email)
    if user is False:
        return False, "user not found"

    if not Utils.check_password(user.first_name + " " + user.last_name, user.salt, environ.get("PEPER"), password, user.hashed_password):
        return False, "invalid password"

    login_token = get_available_login_token(db)
    statement = f"INSERT INTO USER_LOGIN_TOKENS(userID, loginToken) VALUES ({user.id}, '{login_token}');"
    cursor = db.cursor()
    cursor.execute(statement)
    return True, user, login_token


def logout(db, login_token: str):
    user = GetBy.login_token(db, login_token)
    if user.isDummy():
        return False

    print(f"Logging out {repr(user)}")
    cursor = db.cursor()
    cursor.execute(f"DELETE FROM USER_LOGIN_TOKENS WHERE loginToken='{login_token}';")
    return True


def get_available_random_uuid(db):
    while True:
        id = uuid4()
        if GetBy.uuid(db, id).isDummy():
            break
    return id


def get_available_login_token(db):
    while True:
        login_token = Utils.random_string(128)
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM USER_LOGIN_TOKENS WHERE loginToken='{login_token}';")
        data = cursor.fetchall()
        if data is None or len(data) == 0:
            break
    return login_token
