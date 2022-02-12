import random

chars = []
for i in range(26):
    chars.append(chr(ord("a")+i))
    chars.append(chr(ord("A")+i))

for i in range(10):
    chars.append(chr(ord("0")+i))

def random_string(length: int) -> str:
    s = ""
    for i in range(length):
        s += chars[random.randint(0, len(chars)-1)]
    return s