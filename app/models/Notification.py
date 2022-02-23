# DROP TABLE NOTIFICATIONS cascade;
# CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
#     id serial,
#     notificationTypeID integer,
#     notificationLevelID integer,
#     userID varchar(36),
#     description text,
#     solution text,
#     emailed boolean,
#     primary key (id),
#     foreign key (notificationTypeID) references NOTIFICATION_TYPE(id),
#     foreign key (notificationLevelID) references NOTIFICATION_LEVEL(id),
#     foreign key (userID) references USERS(id)
# );

from app import db


class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    notification_level = db.Column(db.String(10), db.CheckConstraint("notification_level IN ('warning', 'alert', 'info')"))
    notification_type = db.Column(db.String(10), db.CheckConstraint("notification_type IN ('learning', 'mentoring', 'expertise')"))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    description = db.Column(db.Text, nullable=True)
    solution = db.Column(db.Text, nullable=True)
    sent = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"Notification('')"
