import app.user as Users
from app.models import Topics
import app.sql as SQL
import app.utils as Utils


class Mentor:
    def __init__(self, id=None, user=None, about=None):
        self.id: int = id
        self.user: Users.User = user
        self.about: str = about

        self.mentorTopics: dict = {}

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key]=value
        r_dict["id"] = self.id
        r_dict["about"] = self.about
        return r_dict

    def __repr__(self):
        return f"Mentor [{self.id},{self.user.id},{self.about}]"

    def isDummy(self):
        return False

    def isLoaded(self):
        return not self.isDummy()


class MentorTopic():
    def __init__(self, id=None, mentor=None, topic=None):
        self.id: int = id
        self.mentor: Mentor = mentor
        self.topic: Topics.Topic = topic
        self.mentor.mentorTopics[self.id] = self

    def __repr__(self):
        return f"MentorTopic [{self.id},{self.mentor.id},{self.topic.id} {self.topic.name}]"


class DummyMentor(Mentor):
    dummyMentor = None

    def __new__(cls, *args, **kwargs):
        if DummyMentor.dummyMentor is None:
            DummyMentor.dummyMentor = super().__new__(cls)
        return DummyMentor.dummyMentor

    def isDummy(self):
        return True


def register(db, user: Users.User, about: str, topics: list) -> tuple:
    if not SQL.is_valid_input(about, *topics):
        return False, "invalid argument to pass to SQL"
    if user.isDummy():
        return False, "user not loaded"

    cursor = db.cursor()
    statement = f"INSERT INTO MENTORS(userID, about) VALUES ({user.id}, '{about}');"
    cursor.execute(statement)
    mentor = GetBy.user(db, user)

    cursor = db.cursor()
    for topic in topics:
        topicID = Topics.GetBy.name(db, topic).id
        cursor.execute(f"INSERT INTO MENTOR_TOPIC_PIVOT(mentorID, topicID) VALUES ({mentor.id}, {topicID});")

    return True, GetBy.user2(db, user)

import app.user.mentor.GetBy as GetBy