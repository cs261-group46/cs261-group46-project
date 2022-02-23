from sqlalchemy.dialects.postgresql import UUID
from app import db

mentors_topics = db.Table('mentor_topics',
                          db.Column('mentorID', UUID(as_uuid=True), db.ForeignKey('mentors.id'), primary_key=True),
                          db.Column('topicID', db.Integer, db.ForeignKey('topics.id'), primary_key=True),
                          db.Column('priority', db.Integer)
                          )


class Mentor(db.Model):
    __tablename__ = 'mentors'
    id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)
    about = db.Column(db.Text, nullable=True)
    score = db.Column(db.Integer, nullable=False)

    topics = db.relationship('Topic', secondary=mentors_topics, backref='mentors', lazy=True)

    def __repr__(self):
        return f"{self.__class__.__name__} ({self.id}, {self.user_id}, {self.score})"
