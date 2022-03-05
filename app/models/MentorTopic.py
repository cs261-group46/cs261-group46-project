from app import db


class MentorTopic(db.Model):
    __tablename__ = 'mentors_topics'
    mentor_id = db.Column(db.Integer, db.ForeignKey('mentors.id'), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), primary_key=True)
    priority = db.Column(db.Integer, nullable=False)
    topic = db.relationship("Topic", backref="mentors", lazy=True)
    mentor = db.relationship("Mentor", backref="topics", lazy=True)
