import app.user as Users
import app.SQL as SQL
import uuid as i_uuid
import app.user.mentor as Mentors


def user(db, user: Users.User) -> list:
    db_id = str(user.database_id)
    if SQL.is_valid_input(db_id):
        mentors = get_by_sql_statement(db, f"SELECT * FROM view_MENTORS WHERE userID='{db_id}';")
        if not (mentors is None):
            return mentors
    return []


def uuid(db, uuid: i_uuid.UUID) -> list:
    id = str(uuid)
    if SQL.is_valid_input(id):
        mentors = get_by_sql_statement(db, f"SELECT * FROM view_MENTORS WHERE userID=(SELECT userID FROM USERS WHERE unique_user_id='{id}');")
        if not (mentors is None):
            return mentors
    return []


def login_token(db, login_token: str):
    if SQL.is_valid_input(login_token):
        mentors = get_by_sql_statement(db, f"SELECT * FROM view_MENTORS WHERE userID=get_user_id_from_token('{login_token}');")
        if not (mentors is None):
            return mentors
    return []


def get_by_sql_statement(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return None
    mentors = []
    for row in data:
        mentor = Mentors.Mentor()
        mentor.user = Users.User()

        mentor.databaseID = row[0]
        mentor.userID = mentor.user.database_id = row[1]
        mentor.subjectID = row[2]

        mentor.user.unique_user_id = i_uuid.UUID(row[3])
        mentor.user.email = row[4]
        mentor.user.first_name = row[5]
        mentor.user.last_name = row[6]
        mentor.user.account_creation_date = row[7]
        mentor.user.verified = row[8]
        mentor.user.departmentID = row[9]
        mentor.user.groupID = row[10]

        mentors.append(mentor)

    return mentors