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
    score = db.Column(db.Float, nullable=False, default=2.5)
    topics = db.relationship(
        'Topic', secondary=mentors_topics, backref='mentors', lazy=True)

    user = db.relationship("User", backref=db.backref("mentor", uselist=False))

    default_fields = ["user", "about", "score", "topics"]

    def __repr__(self):
        return f'<Mentor \n User: {self.user} \n About: {self.about} \n Score: {self.score} \n Topics : {self.topics}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
