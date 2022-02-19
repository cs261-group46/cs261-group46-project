import app as a
import app.utils as Utils
import secrets, random
db = a.db


def register_departments(departments: list):
    cursor = db.cursor()
    for department in departments:
        cursor.execute(f"INSERT INTO DEPARTMENTS(name) VALUES ('{department}');")


def register_topics(topics: list):
    cursor = db.cursor()
    for topic in topics:
        cursor.execute(f"INSERT INTO TOPICS(name) VALUES ('{topic}');")


def register_users_amount(user_count, departments):
    users = []
    for i in range(user_count):
        #db, email: str, password: str, password_repeat: str, first_name: str, last_name: str, department, send_mail=True
        v, u, l = a.Users.register(db, f"{Utils.random_string(8)}.{Utils.random_string(8)}@test.randomnot", "test", "test", Utils.random_string(8), Utils.random_string(8), secrets.choice(departments))
        users.append(u)
    return users

def register_mentors(users, topics, topic_range):
    ma = topic_range[0]
    mb = topic_range[1]
    mentors = []
    for user in users:
        t = []
        for i in range(random.randint(ma, mb+1)):
            found = False
            while not found:
                s = secrets.choice(topics)
                if s not in t:
                    found = True
            t.append(s)

        v, m = a.Users.Mentors.register(db, user, Utils.random_string(8), t)
        mentors.append(m)

def clear_data(tables):
    cursor = db.cursor()
    for table in tables:
        statement = f"DELETE FROM {table};"
        cursor.execute(statement)


def main():
    clear_data(["user_login_tokens", "mentor_mentee_relation", "mentor_subject_pivot","mentor_topic_pivot", "mentors", "mentees", "users"])
    register_departments(departments := ["Statistics", "Computer Science"])
    register_topics(topics := ["CS261", "CS258", "ST221", "ST202", "ST218", "ST219"])
    users = register_users_amount(10, departments)
    register_mentors(users, topics, (1,5))

