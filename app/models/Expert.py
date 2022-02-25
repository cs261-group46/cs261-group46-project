from app import db

experts_topics = db.Table('experts_topics',
    db.Column('expert_id', db.Integer, db.ForeignKey('experts.id'), primary_key=True),
    db.Column('topic_id', db.Integer, db.ForeignKey('topics.id'), primary_key=True),
    db.Column('priority', db.Integer)
)


class Expert(db.Model):
    query: db.Query # Type hint here
    __tablename__ = 'experts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    topics = db.relationship('Topic', secondary=experts_topics, backref='experts', lazy=True)

    def __repr__(self):
        return f"Expert('')"
