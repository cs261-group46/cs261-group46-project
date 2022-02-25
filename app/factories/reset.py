from app import db
from departments_factory import department_factory
from topics_factory import topics_factory


db.drop_all()
db.create_all()

department_factory()
topics_factory()
