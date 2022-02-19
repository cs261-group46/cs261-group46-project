from app import app
df = False

if __name__ == "__main__":

    if df:
        import app.data_factory as DataFactory
        DataFactory.clear_data(["DEPARTMENTS", "TOPICS"])
        DataFactory.register_departments(departments := ["Statistics", "Computer Science"])
        DataFactory.register_topics(topics := ["CS261", "CS258", "ST221", "ST202", "ST218", "ST219"])
        # Call DataFactory stuff here

        raise Exception("END")

    app.run(debug=False)

