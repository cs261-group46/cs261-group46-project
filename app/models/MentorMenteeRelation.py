from sqlalchemy.dialects.postgresql import UUID
from app import db

class MentorMenteeRelation:
    pass

# class MentorMenteeRelation(db.Model):
#     __tablename__ = 'mentor_mentee_relation'
#
#     id = db.Column(db.Integer, primary_key=True)
#     mentee_id = db.Column(db.Integer, db.ForeignKey('mentees.id'), unique=True)
#     mentor_id = db.Column(db.Integer, db.ForeignKey('mentors.id'), nullable=False)
#     topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), primary_key=True)
#     weight = db.Column(db.Float, nullable=False)
#
#     def __repr__(self):
#         return f"{self.__name__} ({self.id}, {self.mentee_id}, {self.mentor_id})"
