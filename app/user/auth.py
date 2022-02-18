from app.user import *
import app.environ as environ

peper = environ.get("PEPER")


def register(db, email: str, password: str, password_repeat: str, first_name: str, last_name: str, department: str):
    if SQL.is_valid_input(email, first_name, last_name, department):
        if Utils.is_password_allowed(password, password_repeat):
            if GetUserBy.email(db, email) == False:
                departmentData = does_department_exist(db, department)
                if not (departmentData == False):
                    user_salt = Utils.random_string(16)
                    hashed_password = Utils.hash_password(password, first_name + " " + last_name, user_salt, peper)
                    id = get_available_random_uuid(db) # Still need to verify unocupied
                    statement = f"INSERT INTO USERS(unique_user_id, email, hashedPassword, salt, firstName, lastName, currentDepartment) " \
                                f"VALUES ('{id}', '{email}', '{hashed_password}', '{user_salt}', '{first_name}', '{last_name}', {departmentData[0]});"
                    cursor = db.cursor()
                    cursor.execute(statement)
                    return login(db, email, password)
                    # return True, "user registered"
                else:
                    return False, "invalid department"
            else:
                return False, "email already used"
        else:
            return False, "invalid password"
    else:
        return False, "invalid argument passed for SQL"


def login(db, email: str, password: str) -> tuple:
    if SQL.is_valid_input(email):
        user = GetUserBy.email(db, email)
        if user == False:
            return False, "user not found"
        else:
            if Utils.check_password(user.first_name + " " + user.last_name, user.salt, peper, password, user.hashed_password):
                login_token = get_available_login_token()
                statement = f"INSERT INTO USER_LOGIN_TOKENS(userID, loginToken) VALUES ({user.database_id}, '{login_token}');"
                cursor = db.cursor()
                cursor.execute(statement)
                return True, user, login_token
            else:
                return False, "invalid password"
    else:
        return False, "invalid argument passed for SQL"


def logout(db, login_token: str):
    user = GetUserBy.login_token(db, login_token)
    if user != False:
        print(f"Logging out {repr(user)}")
        cursor = db.cursor()
        cursor.execute(f"DELETE FROM USER_LOGIN_TOKENS WHERE loginToken='{login_token}';")
        return True
    return False


def get_available_random_uuid(db):
    while True:
        id = uuid.uuid4()
        if GetUserBy.uuid(db, id) == False:
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