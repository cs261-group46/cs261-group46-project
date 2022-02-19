from uuid import UUID

import app.SQL as SQL
import app.user as Users


def email(db, address: str):
    if SQL.is_valid_input(address):
        user = sql_statement(db, f"SELECT * FROM USERS WHERE email='{address}';")
        if not (user is None):
            return user
    return Users.DummyUser()


def uuid(db, id: UUID):
    id = str(id)
    if SQL.is_valid_input(id):
        user = sql_statement(db, f"SELECT * FROM USERS WHERE unique_user_id='{id}';")
        if not (user is None):
            return user
    return Users.DummyUser()


def login_token(db, login_token: str):
    if SQL.is_valid_input(login_token):
        user = sql_statement(db, f"SELECT * FROM USERS WHERE userID=get_user_id_from_token('{login_token}');")
        if not user.isDummy():
            return user
    return Users.DummyUser()


def sql_statement(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return Users.DummyUser()

    databaseID, uuid, email, hashed_password, salt, first_name, last_name, account_creation_date, verified, departmentID, groupID = data[0]

    user = Users.User(id=databaseID, uuid=uuid, email=email,
                      hashed_password=hashed_password, salt=salt,
                      first_name=first_name, last_name=last_name,
                      account_creation_date=account_creation_date, verified=verified,
                      departmentID=departmentID, groupID=groupID)
    return user
