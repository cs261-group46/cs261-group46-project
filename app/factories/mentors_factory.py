from app import Mentor
import random
from app.utils.strings import generate_random_string

# id = db.Column(db.Integer, primary_key=True)
# user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
# about = db.Column(db.Text, nullable=True)
# score = db.Column(db.Float, nullable=False, default=2.5)
# topics = db.relationship(
#     'Topic', secondary=mentors_topics, backref='mentors', lazy=True)

# mentees = db.relationship('Mentee', backref='mentor', lazy=True)

# user = db.relationship("User", backref=db.backref("mentor", uselist=False))


def mentors_factory(users):
    mentors = []
    users = users.copy()
    for _ in range(0, 10):
        user = random.choice(users)
        users.remove(user)
        mentor = Mentor(
            user_id=user.id,
            about=generate_random_string(
                30, allowDigits=False, allowPanctuation=False),
        )
        mentors.append(mentor)

    return mentors
