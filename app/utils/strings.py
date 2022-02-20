import random
import string

def generate_random_string(length: int) -> str:
    return ''.join(random.choice(string.ascii_letters + string.digits + string.punctuation) for _ in range(length))

