from app.models.topics import Topic
import app.sql as SQL


def name(db: SQL.conn, name: str):
    if SQL.is_valid_input(name):
        topic = sql_statement(db, f"SELECT * FROM TOPICS WHERE name='{name}';")
        if topic is not None:
            return topic[0]
    return None

def exists(db: SQL.conn, topic_name: str):
    if name(db, topic_name) is None:
        return False
    return True


def startswith(db: SQL.conn, start: str):
    if SQL.is_valid_input(start):
        topics = sql_statement(db, f"SELECT * FROM TOPICS WHERE name LIKE '{start}%';")
        if topics is not None:
            return topics
    return []


def all(db):
    topics = sql_statement(db, f"SELECT * FROM TOPICS;")
    if topics is not None:
        return topics
    return []


def sql_statement(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return None
    topics = []

    for row in data:
        topics.append(Topic(id=row[0], name=row[1]))

    return topics
