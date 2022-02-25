from app import db, Topic

db.session.add(Topic(name="Trading"))
db.session.add(Topic(name="Craftsmanship"))
db.session.add(Topic(name="Trampoline"))
db.session.add(Topic(name="Skating"))
db.session.add(Topic(name="Football"))
db.session.add(Topic(name="Folklore"))
db.session.commit()
