import app.models.user as Users

from uuid import UUID

from flask.sessions import SessionMixin

import app.sql as sql


def email(db, address: str):
    if sql.is_valid_input(address):
        Users.query.filter_by(email=address)
        user = sql_statement(db, f"SELECT * FROM USERS WHERE email='{address}';")
        if not (user is None):
            return user
    return Users.DummyUser()


def uuid(db, id: UUID):
    id = str(id)
    if sql.is_valid_input(id):
        Users.query.filter_by(unique_user_id=id)
        user = sql_statement(db, f"SELECT * FROM USERS WHERE unique_user_id='{id}';")
        if not (user is None):
            return user
    return Users.DummyUser()


def token(db, token_value: str, token_type: str):
    if sql.is_valid_input(token_value, token_type):
        user = sql_statement(db, f"SELECT * FROM USERS WHERE id=get_user_id_from_token('{token_value}', '{token_type}');")
        if not user.isDummy():
            return user
    return Users.DummyUser()


def login_token(db, login_token: str):
    return token(db, login_token, "LOGIN")


def password_reset_token(db, password_reset_token: str):
    return token(db, password_reset_token, "PASSWORD_RESET")


def email_verify_token(db, email_verify_token: str):
    return token(db, email_verify_token, "EMAIL_VERIFY")


def session(db, login_token_key_str, session: SessionMixin):
    if (token := session.get(login_token_key_str)) is not None:
        return Users.GetBy.login_token(db, token)
    return Users.DummyUser()


def sql_statement(db: sql.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return Users.DummyUser()

    databaseID, uuid, email, hashed_password, salt, first_name, last_name, account_creation_date, verified, expert, departmentID, groupID = data[0]

    user = Users.User(id=databaseID, uuid=UUID(uuid), email=email,
                      hashed_password=hashed_password, salt=salt,
                      first_name=first_name, last_name=last_name,
                      account_creation_date=account_creation_date, verified=verified, expert=expert,
                      departmentID=departmentID, groupID=groupID)
    return user
