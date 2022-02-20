from app import db

mentees_topics = db.Table('mentees_topics',
    db.Column('menteeId', db.Integer, db.ForeignKey('mentees.id'), primary_key=True),
    db.Column('topicId', db.Integer, db.ForeignKey('topics.id'), primary_key=True),
    db.Column('priority', db.Integer)
)


class Mentee(db.Model):
    __tablename__ = 'mentees'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True)
    mentor_iD = db.Column(db.Integer, db.ForeignKey('mentors.id'), nullable=False)
    about = db.Column(db.Text, nullable=True)
    weight = db.Column(db.Float, nullable=False)
    topics = db.relationship('Topic', secondary=mentees_topics, backref='mentees', lazy=True)

    def __repr__(self):
        return f"Mentee('')"
