from api.models import Room


def rooms_factory():
    room1 = Room(name="CS2.14")
    room2 = Room(name="CS1.01")
    room3 = Room(name="CS1.03")
    room4 = Room(name="E3.11")
    room5 = Room(name="E5.12")
    room6 = Room(name="TH1.39K")
    room7 = Room(name="TV1.39K")
    room8 = Room(name="AV.3K4")

    return [room1, room2, room3, room4, room5, room6, room7, room8]
