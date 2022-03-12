
class ConcurrentContext:
    def __init__(self):
        self.objects = {}

    def get(self, objectType: type, id: int):
        if objectType in self.objects:
            if id in self.objects[objectType]:
                return self.objects[objectType][id]
        return None

    def new(self, cls, *args, **kwargs):
        if "id" in kwargs.keys():
            id = kwargs["id"]
        else:
            raise Exception("Concurrent context needs ids (dynamic PK finding not implemented)")
        c = self.get(cls, id)
        if c is not None:
            return c

        # obj = super(type(cls), cls).__new__(cls, *args, id=id, **kwargs)
        # obj.__init__(*args, id=id, **kwargs)
        # The Above was absolute overkill. it worked, but was not needed, and was like building an object with type()
        obj = cls(*args, **kwargs)

        if cls not in self.objects.keys():
            self.objects[cls] = {}
        if id not in self.objects[cls].keys():
            self.objects[cls][id] = obj
        return obj


