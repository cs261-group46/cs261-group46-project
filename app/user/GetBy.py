import uuid as i_uuid

import app.SQL as SQL
import app.user as Users


def email(db, address: str):
    if SQL.is_valid_input(address):
        user = get_user_by_sql_statement(db, f"SELECT * FROM USERS WHERE email='{address}';")
        if not (user is None):
            return user
    return Users.DummyUser()


def uuid(db, id: i_uuid.UUID):
    id = str(id)
    if SQL.is_valid_input(id):
        user = get_user_by_sql_statement(db, f"SELECT * FROM USERS WHERE unique_user_id='{id}';")
        if not (user is None):
            return user
    return Users.DummyUser()


def login_token(db, login_token: str):
    if SQL.is_valid_input(login_token):
        user = get_user_by_sql_statement(db, f"SELECT * FROM USERS WHERE userID=get_user_id_from_token('{login_token}');")
        if not user.isDummy():
            return user
    return Users.DummyUser()


def get_user_by_sql_statement(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return Users.DummyUser()
    user = Users.User()
    user.database_id = data[0][0]
    user.unique_user_id = i_uuid.UUID(data[0][1])
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
