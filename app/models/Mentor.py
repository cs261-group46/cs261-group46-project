from app import db, ma
from app.models.BaseModel import BaseModel

# mentors_topics = db.Table('mentors_topics',
#                           db.Column('mentor_id', db.Integer, db.ForeignKey(
#                               'mentors.id'), primary_key=True),
#                           db.Column('topic_id', db.Integer, db.ForeignKey(
#                               'topics.id'), primary_key=True),
#                           db.Column('priority', db.Integer)
#                           )



class Mentor(db.Model):
    __tablename__ = 'mentors'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    about = db.Column(db.Text, nullable=True)
    score = db.Column(db.Float, nullable=False, default=2.5)
    capacity = db.Column(db.Integer, nullable=False, default=5)

    user = db.relationship("User", backref=db.backref("mentor", uselist=False))

    def __repr__(self):
        return f'<Mentor \n User: {self.user} \n About: {self.about} \n Score: {self.score} \n Topics : {self.topics}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self

