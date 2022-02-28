from sqlalchemy.dialects.postgresql import UUID
from app import db

mentees_topics = db.Table('mentee_topics',
                          db.Column('menteeID', UUID(as_uuid=True), db.ForeignKey('mentees.id'), primary_key=True),
                          db.Column('topicID', db.Integer, db.ForeignKey('topics.id'), primary_key=True),
                          db.Column('priority', db.Integer)
                          )


class Mentee(db.Model):
    __tablename__ = 'mentees'
    id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)
    mentor_ID = db.Column(UUID(as_uuid=True), db.ForeignKey('mentors.id'), nullable=False)
    about = db.Column(db.Text, nullable=True)
    weight = db.Column(db.Float, nullable=False)

    topics = db.relationship('Topic', secondary=mentees_topics, backref='mentees', lazy=True)

    def __repr__(self):
        return f"{self.__class__.__name__} ({self.id}, {self.user_id}, {self.weight})"