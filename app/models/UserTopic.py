from app import db, ma
from app.models.BaseModel import BaseModel


class UserTopic(db.Model):
    __tablename__ = 'users_topics'
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
    topic_id = db.Column('topic_id', db.Integer, db.ForeignKey('topics.id'), primary_key=True)
    priority = db.Column('priority', db.Integer)
    topic = db.relationship("Topic", backref="users", lazy=True)
    user = db.relationship("User", backref="topics", lazy=True)

    default_fields = ["topic", "priority", "user"]


# class UserTopicSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = UserTopic
#
#     priority = ma.auto_field()
#     # user
#     # topic
