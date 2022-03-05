from app import db


class MenteeFeedback(db.Model):
    __tablename__ = "mentee_feedback"

    id = db.Column(db.Integer, primary_key=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey('mentors.id'), nullable=False)
    mentee_id = db.Column(db.Integer, db.ForeignKey('mentees.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text, nullable=False)
    weight = db.Column(db.Float, nullable=False)

    mentee = db.relationship("Mentee", backref="received_feedback", lazy=True)
    mentor = db.relationship("Mentor", backref="feedback_given", lazy=True)

    def __repr__(self):
        return f'<MenteeFeedback \n Mentee: {self.mentee} \n Mentor: {self.mentor} \n Score: {self.score} \n Feedback: {self.feedback}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self