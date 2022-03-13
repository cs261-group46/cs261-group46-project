from api.app import db
from api.factories.mentees_factory import mentees_factory
from api.factories.mentors_factory import mentors_factory
from api.factories.departments_factory import department_factory
from api.factories.topics_factory import topics_factory
from api.factories.users_factory import users_factory
from api.factories.rooms_factory import rooms_factory


def reset():
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

    mentors = mentors_factory(users, topics)
    db.session.add_all(mentors)
    db.session.commit()

    mentees = mentees_factory(users, mentors, topics)
    db.session.add_all(mentees)
    db.session.commit()

    rooms = rooms_factory()
    db.session.add_all(rooms)
    db.session.commit()
