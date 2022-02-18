import hashlib
import uuid
import hmac

secret_key: str = None


def hash_password(password, username, salt, peper):
    hashed_username = hash_string(username)
    return hash_string(salt + peper + hashed_username + password)


def check_password(username, salt, peper, attempted_password, actual_password):
    hash_attempt = hash_password(attempted_password, username, salt, peper)
    equals = hmac.compare_digest(hash_attempt, actual_password)
    return equals  # hash_attempt == actual_password


def hash_string(text: str) -> str:
    b64p = text.encode()
    crypt = hashlib.sha512()
    crypt.update(b64p)
    return str(crypt.hexdigest())


def is_password_allowed(password, repeat) -> bool:
    if password == repeat:
        return True
    else:
        return False