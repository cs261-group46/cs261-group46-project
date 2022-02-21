import secrets
import string

chars = string.ascii_lowercase + string.ascii_uppercase + string.digits


def random_string(length: int) -> str:
    return "".join(secrets.choice(chars) for _ in range(length))


