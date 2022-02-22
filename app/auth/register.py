from uuid import uuid4
from werkzeug.security import generate_password_hash
from app.validators.RegisterValidator import validator as register_validator

from app import db, Department, User
from app.auth import login, send_verification_email


def register(email: str, password: str, password_repeat: str, first_name: str, last_name: str, department_name: str) -> tuple:

    register_validator.validate({"email": email, "password": password, "password_repeat": password_repeat, "first_name": first_name, "last_name": last_name})
    if register_validator.errors:
        print(register_validator.errors)
        return False, register_validator.errors, None, 401

    department = Department.query.filter_by(name=department_name).first()
    if department is None:
        return False, {"department": "The selected department does not exist"}, None, 401

    user_with_email = User.query.filter_by(email=email).first()
    if user_with_email is not None:
        return False, {"email": "An account with the given email already exists"}, None, 401

    hashed_password = generate_password_hash(password=password)

    uuid = get_available_uuid()
    new_user = User(id=uuid, email=email, hashed_password=hashed_password, first_name=first_name, last_name=last_name, department_id=department.id)

    db.session.add(new_user)
    db.session.commit()

    send_verification_email(new_user)

    return login(email, password)


def get_available_uuid():
    while User.query.filter_by(id=(uuid := uuid4())).first() is not None:
        continue
    return uuid