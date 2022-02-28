from app import db
from app.models.BaseModel import BaseModel

mentors_topics = db.Table('mentors_topics',
                          db.Column('mentor_id', db.Integer, db.ForeignKey(
                              'mentors.id'), primary_key=True),
                          db.Column('topic_id', db.Integer, db.ForeignKey(
                              'topics.id'), primary_key=True),
                          db.Column('priority', db.Integer)
                          )


class Mentor(BaseModel):
    __tablename__ = 'mentors'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    about = db.Column(db.Text, nullable=True)
    score = db.Column(db.Integer, nullable=False, default=0)
    topics = db.relationship(
        'Topic', secondary=mentors_topics, backref='mentors', lazy=True)
    mentees = db.relationship('Mentee', backref='mentor', lazy=True)

    def __repr__(self):
        return f"Mentor('')"

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
