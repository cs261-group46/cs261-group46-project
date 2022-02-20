

class Topic:
    def __init__(self, id=None, name=None):
        self.id: int = id
        self.name: str = name

    def __repr__(self):
        return f"Topic [{self.id}, {self.name!r}]"


import app.models.topic.GetBy as GetBy
Topic.GetBy = GetBy
