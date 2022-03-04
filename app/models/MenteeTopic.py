from app import db, ma


class MenteeTopic(db.Model):
    __tablename__ = 'mentees_topics'
    mentee_id = db.Column(db.Integer, db.ForeignKey('mentees.id'), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), primary_key=True)
    priority = db.Column(db.Integer, nullable=False)
    topic = db.relationship("Topic", backref="mentees", lazy=True)
    mentee = db.relationship("Mentee", backref="topics", lazy=True)
