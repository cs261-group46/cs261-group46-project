from app import db, Department

d1 = Department(name="Computer Science")
d2 = Department(name="Economics")
d3 = Department(name="Humanities")
d4 = Department(name="Geography")

db.session.add(d1)
db.session.add(d2)
db.session.add(d3)
db.session.add(d4)
db.session.commit()
