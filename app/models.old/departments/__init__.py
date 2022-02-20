

class Department:
    def __init__(self, id=None, name=None):
        self.id: int = id
        self.name: str = name

    def __repr__(self):
        return f"{self.__class__} [{self.id}, {self.name!r}]"


import app.models.departments.GetBy as GetBy
Department.GetBy = GetBy
