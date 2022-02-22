from sqlalchemy.dialects.postgresql import UUID
from app import db

meeting_topics = db.Table('meeting_topics',
                          db.Column('meetingID', db.Integer, db.ForeignKey('meetings.id'), primary_key=True),
                          db.Column('topicID', db.Integer, db.ForeignKey('topics.id'), primary_key=True)
                          )
meeting_attendees = db.Table('meeting_attendees',
                             db.Column('meetingID', db.Integer, db.ForeignKey('meetings.id'), primary_key=True),
                             db.Column('userID', UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)
                             )


class MeetingType(db.Model):
    __tablename__ = "meeting_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    # users = db.relationship("User", backref="department", lazy=True)

    def __repr__(self):
        return f"{self.__name__} ({self.id}, {self.name})"


class Meeting(db.Model):
    __tablename__ = 'meetings'

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    planned_date = db.Column(db.DateTime, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey("rooms.id"), nullable=False)
    link = db.Column(db.Text, nullable=True)
    type_id = db.Column(db.Integer, db.ForeignKey("meeting_types.id"), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Text, nullable=False)

    topics = db.relationship('Topic', secondary=meeting_topics, backref='meetings', lazy=True)
    attendees = db.relationship('User', secondary=meeting_attendees, backref='meetings', lazy=True)

    def __repr__(self):
        return f"{self.__name__} ({self.id}, {self.user_id}, {self.weight})"
