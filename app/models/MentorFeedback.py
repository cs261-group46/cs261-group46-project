from app import db
from app.models.BaseModel import BaseModel


class MentorFeedback(db.Model):
    __tablename__ = "mentor_feedback"

    id = db.Column(db.Integer, primary_key=True)
    mentee_id = db.Column(db.Integer, db.ForeignKey('mentees.id'), nullable=False)
    mentor_id = db.Column(db.Integer, db.ForeignKey('mentors.id'), nullable=False)
    score = db.Column(db.Integer, nullable=True)
    feedback = db.Column(db.Text, nullable=True)
    weight = db.Column(db.Float, nullable=False)

    mentor = db.relationship("Mentor", backref="received_feedback", lazy=True)
    mentee = db.relationship("Mentee", backref="feedback_given", lazy=True)

    def __repr__(self):
        return f'<MentorFeedback \n Mentor: {self.mentor} \n Mentee: {self.mentee} \n Score: {self.score} \n Feedback: {self.feedback}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
