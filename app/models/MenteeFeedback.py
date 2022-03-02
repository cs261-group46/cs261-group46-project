from app import db
from app.models.BaseModel import BaseModel


class MenteeFeedback(BaseModel):
    __tablename__ = "mentee_feedback"

    id = db.Column(db.Integer, primary_key=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey('mentors.id'), nullable=False)
    mentee_id = db.Column(db.Integer, db.ForeignKey('mentees.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text, nullable=False)

    mentee = db.relationship("Mentee", backref="received_feedback", lazy=True)
    mentor = db.relationship("Mentor", backref="feedback_given", lazy=True)

    default_fields = ["score", "feedback", "mentor", "mentee"]

    def __repr__(self):
        return f'<MenteeFeedback \n Mentee: {self.mentee} \n Mentor: {self.mentor} \n Score: {self.score} \n Feedback: {self.feedback}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self