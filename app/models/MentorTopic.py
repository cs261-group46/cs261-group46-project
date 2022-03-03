from app import db, ma
# from app.models.BaseModel import BaseModel


class MentorTopic(db.Model):
    __tablename__ = 'mentors_topics'
    mentor_id = db.Column('mentor_id', db.Integer, db.ForeignKey('mentors.id'), primary_key=True)
    topic_id = db.Column('topic_id', db.Integer, db.ForeignKey('topics.id'), primary_key=True)
    priority = db.Column('priority', db.Integer)
    topic = db.relationship("Topic", backref="mentors", lazy=True)
    mentor = db.relationship("Mentor", backref="topics", lazy=True)

    default_fields = ["topic", "priority"]
