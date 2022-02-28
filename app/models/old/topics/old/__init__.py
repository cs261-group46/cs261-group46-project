

class Topic:
    def __init__(self, id=None, name=None):
        self.id: int = id
        self.name: str = name

    def __repr__(self):
        return f"Topic [{self.id}, {self.name!r}]"


import app.models.topics.GetBy as GetBy
import app.models.topics.query as query
Topic.GetBy = GetBy
