import datetime
import uuid

try:
    import app.PasswordHashing as PasswordHashing
    import app.Utils as Utils
except Exception as _:
    import PasswordHashing
    import Utils

if __name__ == "__main__":
    import app.SQL as SQL
    db: SQL.conn
    peper: str
else:
    SQL = None
    db = None
    peper = None


def register(email: str, password: str, password_repeat: str, first_name: str, last_name: str, department: str):
    if SQL.is_valid_input(email, first_name, last_name, department):
        if PasswordHashing.is_password_allowed(password, password_repeat):
            if GetUserBy.email(email) == False:
                departmentData = does_department_exist(department)
                if not (departmentData == False):
                    user_salt = Utils.random_string(16)
                    hashed_password = PasswordHashing.hash_password(password, first_name + " " + last_name, user_salt, peper)
                    id = uuid.uuid4() # Still need to verify unocupied
                    statement = f"INSERT INTO USERS(unique_user_id, email, hashedPassword, salt, firstName, lastName, currentDepartment) " \
                                f"VALUES ('{id}', '{email}', '{hashed_password}', '{user_salt}', '{first_name}', '{last_name}', {departmentData[0]});"
                    print(statement)
                    cursor = db.cursor()
                    cursor.execute(statement)
                    return login(email, password)
                    # return True, "user registered"
                else:
                    return False, "invalid department"
            else:
                return False, "email already used"
        else:
            return False, "invalid password"
    else:
        return False, "invalid argument passed for SQL"


def login(email: str, password: str) -> tuple:
    if SQL.is_valid_input(email):
        user = GetUserBy.email(email)
        if user == False:
            return False, "user not found"
        else:
            if PasswordHashing.check_password(user.first_name + " " + user.last_name, user.salt, peper, password, user.hashed_password):
                login_token = get_available_login_token()
                statement = f"INSERT INTO USER_LOGIN_TOKENS(userID, loginToken) VALUES ({user.database_id}, '{login_token}');"
                cursor = db.cursor()
                cursor.execute(statement)
                return True, user, login_token
            else:
                return False, "invalid password"
    else:
        return False, "invalid argument passed for SQL"


def logout(login_token: str):
    user = GetUserBy.login_token(login_token)
    if user != False:
        print(f"Logging out {repr(user)}")
        cursor = db.cursor()
        cursor.execute(f"DELETE FROM USER_LOGIN_TOKENS WHERE loginToken='{login_token}';")
        return True
    return False


class User:
    """This is just a data class"""
    def __init__(self):
        self.database_id: int = None
        self.unique_user_id: uuid.UUID = None
        self.email: str = None
        self.first_name: str = None
        self.last_name: str = None
        self.account_creation_date: datetime.datetime = None
        self.verified: bool = None
        self.hashed_password: str = None
        self.salt: str = None
        self.departmentID: int = None
        self.groupID: int = None

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key]=value
        r_dict["uuid"] = self.unique_user_id
        r_dict["first_name"] = self.first_name
        r_dict["last_name"] = self.last_name
        return r_dict

    def __eq__(self, other):
        if isinstance(other, User):
            return self.database_id == other.database_id
        return False

    def __repr__(self):
        return f"User [{self.database_id},{self.email},{self.first_name} {self.last_name}, {self.verified}]"


class GetUserBy:
    @staticmethod
    def email(address: str):
        if SQL.is_valid_input(address):
            user = GetUserBy.get_user_by_sql_statement(f"SELECT * FROM USERS WHERE email='{address}';")
            if not (user is None):
                return user
        return False

    @staticmethod
    def uuid(id: uuid.UUID):
        id = str(id)
        if SQL.is_valid_input(id):
            user = GetUserBy.get_user_by_sql_statement(f"SELECT * FROM USERS WHERE unique_user_id='{id}';")
            if not (user is None):
                return user
        return False

    @staticmethod
    def login_token(login_token: str):
        if SQL.is_valid_input(login_token):
            user = GetUserBy.get_user_by_sql_statement(f"SELECT * FROM USERS WHERE userID=get_user_id_from_token('{login_token}');")
            if not (user is None):
                return user
        return False

    @staticmethod
    def get_user_by_sql_statement(statement):
        cursor = db.cursor()
        cursor.execute(statement)
        data = cursor.fetchall()
        if len(data) == 0:
            return None
        user = User()
        user.database_id = data[0][0]
        user.unique_user_id = uuid.UUID(data[0][1])
        user.email = data[0][2]
        user.hashed_password = data[0][3]
        user.salt = data[0][4]
        user.first_name = data[0][5]
        user.last_name = data[0][6]
        user.account_creation_date = data[0][7]
        user.verified = data[0][8]
        user.departmentID = data[0][9]
        user.groupID = data[0][10]
        return user


def does_department_exist(department: str):
    if SQL.is_valid_input(department):
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM DEPARTMENTS WHERE departmentName='{department}';")
        data = cursor.fetchall()
        if len(data) == 0:
            return False
        return data[0]
    else:
        return False


def get_available_random_uuid():
    while True:
        id = uuid.uuid4()
        if GetUserBy.uuid(id) == False:
            break
    return id

def get_available_login_token():
    while True:
        login_token = Utils.random_string(128)
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM USER_LOGIN_TOKENS WHERE loginToken='{login_token}';")
        data = cursor.fetchall()
        if data is None or len(data) == 0:
            break
    return login_token


def get_all_departments():
    statement = f"SELECT * FROM DEPARTMENTS;"
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    r_data = {}
    for row in data:
        r_data[row[0]] = row[1]
    return r_data
