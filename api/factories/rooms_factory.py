from api.models import Room


def rooms_factory():
    room1 = Room(name="CS2.14")
    room2 = Room(name="E5.12")
    room3 = Room(name="TH1.39K")
    room4 = Room(name="TV1.39K")

    return [room1, room2, room3, room4]
