from app import db
from app.factories.mentees_factory import mentees_factory
from app.factories.mentors_factory import mentors_factory
from departments_factory import department_factory
from topics_factory import topics_factory
from users_factory import users_factory
from rooms_factory import rooms_factory

db.drop_all()
db.create_all()

departments = department_factory()
db.session.add_all(departments)
db.session.commit()

topics = topics_factory()
db.session.add_all(topics)
db.session.commit()

users = users_factory(departments)
db.session.add_all(users)
db.session.commit()

mentors = mentors_factory(users)
db.session.add_all(mentors)
db.session.commit()

mentees = mentees_factory(users, mentors)
db.session.add_all(mentees)
db.session.commit()

rooms = rooms_factory()
db.session.add_all(rooms)
db.session.commit()
