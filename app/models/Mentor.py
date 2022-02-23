from app import db

mentors_topics = db.Table('mentors_topics',
    db.Column('mentorId', db.Integer, db.ForeignKey('mentors.id'), primary_key=True),
    db.Column('topicId', db.Integer, db.ForeignKey('topics.id'), primary_key=True),
    db.Column('priority', db.Integer)
)

class Mentor(db.Model):
    __tablename__ = 'mentors'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    about = db.Column(db.Text, nullable=True)
    score = db.Column(db.Integer, nullable=False)
    topics = db.relationship('Topic', secondary=mentors_topics, backref='mentors', lazy=True)

    def __repr__(self):
        return f"Mentor('')"
