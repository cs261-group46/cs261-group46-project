import secrets
import string


def generate_random_string(length: int, allowDigits=True, allowPanctuation=True) -> str:
    characterSpace = string.ascii_letters
    if allowDigits:
        characterSpace += string.digits
    if allowPanctuation:
        characterSpace += string.punctuation

    return ''.join(secrets.choice(characterSpace) for _ in range(length))
