from app import db, Department

db.session.add(Department(name="Computer Science"))
db.session.add(Department(name="Statistics"))
db.session.add(Department(name="Economics"))
db.session.add(Department(name="Humanities"))
db.session.add(Department(name="Geography"))
db.session.commit()