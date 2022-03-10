from sqlalchemy.orm import backref

from app import db


class MeetingFeedback(db.Model):
    __tablename__ = "meeting_feedback"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)
    meeting_id = db.Column(db.Integer, db.ForeignKey(
        'meetings.id'), nullable=False)
    feedback = db.Column(db.Text, nullable=False)

    user = db.relationship('User', backref="meeting_feedback", lazy=True)
    meeting = db.relationship('Meeting', backref=backref("feedback", cascade="all, delete-orphan"), lazy=True)

    def __repr__(self):
        return f'<MeetingFeedback \n User: {self.user} \n Meeting: {self.meeting} \n Feedback: {self.feedback}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
