from sqlalchemy.dialects.postgresql import UUID
from app import db


class ExpertTopic(db.Model):
    __tablename__ = "expert_topics"

    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), primary_key=True)

    # users = db.relationship("User", backref="department", lazy=True)

    def __repr__(self):
        return f"{self.__class__.__name__} ({self.user_id}, {self.topic_id})"
