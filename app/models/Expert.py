from app import db
from app.models.BaseModel import BaseModel

experts_topics = db.Table('experts_topics',
                          db.Column('expert_id', db.Integer, db.ForeignKey(
                              'experts.id'), primary_key=True),
                          db.Column('topic_id', db.Integer, db.ForeignKey(
                              'topics.id'), primary_key=True),
                          db.Column('priority', db.Integer)
                          )


class Expert(BaseModel):
    __tablename__ = 'experts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    topics = db.relationship(
        'Topic', secondary=experts_topics, backref='experts', lazy=True)

    def __repr__(self):
        return f"Expert('')"

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
