import app.models.mentor as Mentors
import app.models.topics as Topics
import app.models.user as Users

import app.sql as SQL
from uuid import UUID
from app.utils import ConcurrentContext


def user(db, user: Users.User) -> Mentors.Mentor:
    db_id = str(user.id)
    if SQL.is_valid_input(db_id):
        mentor = sql_statement(db, f"SELECT * FROM view_MENTORS WHERE userID='{db_id}';")
        if not (mentor is None):
            return mentor[0]
    return None


def user2(db, user: Users.User) -> Mentors.Mentor:
    db_id = str(user.id)
    if SQL.is_valid_input(db_id):
        mentor = sql_statement_2(db, f"SELECT * FROM view_MENTOR_TOPICS WHERE userID='{db_id}';")
        if not (mentor is None):
            return mentor[0]
    return None


def uuid(db, uuid: UUID):
    id = str(uuid)
    if SQL.is_valid_input(id):
        mentor = sql_statement(db, f"SELECT * FROM view_MENTORS WHERE userID=(SELECT id FROM USERS WHERE unique_user_id='{id}');")
        if not (mentor is None):
            return mentor[0]
    return None


def login_token(db, login_token: str):
    if SQL.is_valid_input(login_token):
        mentor = sql_statement(db, f"SELECT * FROM view_MENTORS WHERE userID=get_user_id_from_token('{login_token}', 'LOGIN');")
        if not (mentor is None):
            return mentor[0]
    return None


def sql_statement(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return None
    mentors = []
    for row in data:
        mentorID, userID, about, uuid, email, first_name, last_name, accountCreationDate, verified, currentDepartment, groupID = row

        # topic = Topics.Topic(context=concurrentContext, id=topicID, name=name)

        user = Users.User(id=userID, uuid=uuid, email=email, first_name=first_name, last_name=last_name,
                          account_creation_date=accountCreationDate, verified=verified,
                          departmentID=currentDepartment, groupID=groupID)

        mentors.append(Mentors.Mentor(id=mentorID, user=user, about=about))
    return mentors


def sql_statement_2(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return None

    context = ConcurrentContext()
    for row in data:
        mentorID, userID, about, mentorTopicID, topicID, name, uuid, email, first_name, last_name, accountCreationDate, verified, currentDepartment, groupID = row

        topic: Topics.Topic = context.new(Topics.Topic, id=topicID, name=name)
        # topic = Topics.Topic(context=concurrentContext, id=topicID, name=name)

        user: Users.User = context.new(Users.User, id=userID, uuid=uuid, email=email, first_name=first_name, last_name=last_name, account_creation_date=accountCreationDate, verified=verified, departmentID=currentDepartment, groupID=groupID)
        mentor: Mentors.Mentor = context.new(Mentors.Mentor, id=mentorID, user=user, about=about)
        mentor_topic: Mentors.MentorTopic = context.new(Mentors.MentorTopic, id=topicID, mentor=mentor, topic=topic)
    context_mentors: dict = context.objects[Mentors.Mentor]
    return list(context_mentors.values())