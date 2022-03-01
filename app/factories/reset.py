from app import db
from departments_factory import department_factory
from topics_factory import topics_factory
from user_factory import user_factory

db.drop_all()
db.create_all()

departments = department_factory()
db.session.add_all(departments)
db.session.commit()

topics = topics_factory()
db.session.add_all(topics)
db.session.commit()

users = user_factory(departments)
db.session.add_all(users)
db.session.commit()
