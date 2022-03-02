from app import db
from app.models.BaseModel import BaseModel


class UserTopic(BaseModel):
    __tablename__ = 'users_topics'
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
    topic_id = db.Column('topic_id', db.Integer, db.ForeignKey('topics.id'), primary_key=True)
    priority = db.Column('priority', db.Integer)
    topic = db.relationship("Topic", backref="users", lazy=True)
    user = db.relationship("User", backref="topics", lazy=True)

    default_fields = ["topic", "priority", "user"]
