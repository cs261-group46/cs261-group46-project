import app.user as Users
import app.sql as SQL
from uuid import UUID
import app.user.mentee as Mentees


def user(db, user: Users.User) -> list:
    db_id = str(user.id)
    if SQL.is_valid_input(db_id):
        mentees = sql_statement(db, f"SELECT * FROM view_MENTEES WHERE userID='{db_id}';")
        if not (mentees is None):
            return mentees
    return []


def uuid(db, uuid: UUID) -> list:
    id = str(uuid)
    if SQL.is_valid_input(id):
        mentees = sql_statement(db, f"SELECT * FROM view_MENTEES WHERE userID=(SELECT id FROM USERS WHERE unique_user_id='{id}');")
        if not (mentees is None):
            return mentees
    return []


def login_token(db, login_token: str):
    if SQL.is_valid_input(login_token):
        mentees = sql_statement(db, f"SELECT * FROM view_MENTEES WHERE userID=get_user_id_from_token('{login_token}', 'LOGIN');")
        if not (mentees is None):
            return mentees
    return []


def sql_statement(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return None
    mentees = []
    for row in data:
        mentee = Mentees.Mentee()
        mentee.user = Users.User()
        mentee.databaseID = row[0]
        mentee.usedID = mentee.user.database_id = row[1]
        mentee.topicID = row[2]

        mentee.user.unique_user_id = UUID(row[3])
        mentee.user.email = row[4]
        mentee.user.first_name = row[5]
        mentee.user.last_name = row[6]
        mentee.user.account_creation_date = row[7]
        mentee.user.verified = row[8]
        mentee.user.departmentID = row[9]
        mentee.user.groupID = row[10]

        mentees.append(mentee)

    return mentees
