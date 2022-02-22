from sqlalchemy.dialects.postgresql import UUID
from app import db


class ApplicationFeedback(db.Model):
    __tablename__ = "application_feedback"

    id = db.Column(db.Integer, primary_key=True)
    user_id= db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer)
    feedback = db.Column(db.Text)


class PairingFeedback(db.Model):
    __tablename__ = "pairing_feedback"

    id = db.Column(db.Integer, primary_key=True)
    writer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    target_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer)
    feedback = db.Column(db.Text)


class MeetingFeedback(db.Model):
    __tablename__ = "meeting_feedback"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    meeting_id = db.Column(db.Integer, db.ForeignKey('meetings.id'), nullable=False)
    feedback = db.Column(db.Text)


