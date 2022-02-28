from app.models.utils.fake_alchemy import Model, View
from app.models.utils.fake_alchemy.filter_types import Like
from app.models import Topic, User
from app.sql import is_valid_input
from app.utils import ConcurrentContext
from app.models.utils.model_filters import get_user_filters


class Mentor(get_user_filters("userID")):
    __tablename__ = "MENTORS"

    def convert_to_data_type(self, row: list, concurrent_context=None):
        databaseID, userID, about, score = row
        kwargs = {"id": databaseID, "userID": userID, "about": about, "score": score}
        if concurrent_context:
            concurrent_context: ConcurrentContext
            concurrent_context.new(Mentor, **kwargs)
        else:
            return Mentor(**kwargs)


class MentorTopic(Model):
    __tablename__ = "MENTOR_TOPICS"

    def convert_to_data_type(self, row: list, concurrent_context=None):
        databaseID, mentorID, topicID, priority = row
        kwargs = {"id": databaseID, "mentorID": mentorID, "topicID": topicID, "priority": priority}
        if concurrent_context:
            concurrent_context: ConcurrentContext
            concurrent_context.new(MentorTopic, **kwargs)
        else:
            return MentorTopic(**kwargs)


# class vMentor(View):
#     __tablename__ = "view_MENTOR_TOPICS"
#
#     # id = Column(Serial, primary_key=True)
#     # name = Column(VarChar(128), unique=True)
#
#     def __repr__(self):
#         return f"vMentor []"
#
#     def convert_to_data_type(self, row: list, concurrent_context=None):
#         mentorID, userID, about, mentorTopicID, topicID, topic_name, uuid, email, first_name, last_name, accountCreationDate, verified, departmentID, groupID, score, priority = row
#
#
#         if concurrent_context:
#             concurrent_context: ConcurrentContext
#
#             topic:        Topic       = concurrent_context.new(Topic, id=topicID, name=topic_name)
#             user:         User        = concurrent_context.new(User, id=userID, unique_user_id=uuid, email=email, firstName=first_name, lastName=last_name, accountCreationDate=accountCreationDate, verified=verified, departmentID=departmentID, groupID=groupID)
#             mentor:       Mentor      = concurrent_context.new(Mentor, id=mentorID, userID=userID, about=about, score=score)
#             mentor_topic: MentorTopic = concurrent_context.new(MentorTopic, id=topicID, mentorID=mentorID, topicID=topicID, priority=priority)
#
#             return mentor
#
#
#
#         # topic = Topics.Topic(context=concurrentContext, id=topicID, name=name)
#
#
#         else:
#             return Mentor(id=mentorID, userID=userID, about=about, score=score)


query = vMentor()

select = query.select