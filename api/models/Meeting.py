from api.app import db


meetings_topics = db.Table('meetings_topics',
                          db.Column('meetingID', db.Integer, db.ForeignKey('meetings.id'), primary_key=True),
                          db.Column('topicID', db.Integer, db.ForeignKey('topics.id'), primary_key=True)
                          )
meetings_attendees = db.Table('meetings_attendees',
                             db.Column('meetingID', db.Integer, db.ForeignKey('meetings.id'), primary_key=True),
                             db.Column('userID', db.Integer, db.ForeignKey('users.id'), primary_key=True)
                             )

meetings_invited = db.Table('meetings_invited',
                             db.Column('meetingID', db.Integer, db.ForeignKey('meetings.id'), primary_key=True),
                             db.Column('userID', db.Integer, db.ForeignKey('users.id'), primary_key=True)
                             )

class Meeting(db.Model):
    __tablename__ = 'meetings'

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey("rooms.id"), nullable=True)
    link = db.Column(db.Text, nullable=True)
    meeting_type = db.Column(db.String(18), db.CheckConstraint(
        "meeting_type IN ('workshop', 'group session', 'one on one meeting')"))
    duration = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=True, default="")

    room = db.relationship("Room", backref="meetings", lazy=True)
    host = db.relationship("User", backref="meetings_hosted", lazy=True)
    topics = db.relationship('Topic', secondary=meetings_topics, backref='meetings', lazy=True)
    invited = db.relationship('User', secondary=meetings_invited, backref='meetings_invited', lazy=True)
    attendees = db.relationship('User', secondary=meetings_attendees, backref='meetings_attending', lazy=True)

    def __repr__(self):
        return f'<Meeting \n Host: {self.host} \n Title: {self.title} \n Date: {self.date} \n Room: {self.room} \n Link: {self.link} \n MeetingType: {self.meeting_type} \n Duration: {self.duration} \n Capacity: {self.capacity}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
