from app import Department


def department_factory():
    department1 = Department(name="Computer Science")
    department2 = Department(name="Economics")
    department3 = Department(name="Humanities")
    department4 = Department(name="Geography")

    return [department1, department2, department3, department4]
