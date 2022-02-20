import psycopg2

def fillDatabase(db):
    cur = db.cursor()

    sqlDelete = "TRUNCATE departments, notification_type CASCADE"

    cur.execute(sqlDelete)
    db.commit()
    
    with open("app\\sql\\dummydata\\departments.csv",'r') as f:
        next(f)
        cur.copy_from(f,'departments', sep=',')
        f.close()
    db.commit()

    with open('app\\sql\\dummydata\\notificationType.csv','r') as g:
        next(g)
        cur.copy_from(g,'notification_type', sep=',')
        g.close()
    db.commit()