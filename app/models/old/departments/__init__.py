from app.models.utils.fake_alchemy import Model, ModelGroup, Column, ColumnType, Serial, Text, VarChar
from app.models.utils.fake_alchemy.filter_types import Like
from app.sql import is_valid_input
from app.utils import ConcurrentContext


class Department(Model):
    __tablename__ = "departments"

    # id = Column(Serial, primary_key=True)
    # name = Column(VarChar(128), unique=True)

    def __repr__(self):
        return f"Department [{self.id}, {self.name}]"

    def convert_to_data_type(self, row: list, concurrent_context=None):
        databaseID, name = row

        kwargs = {
            "id": databaseID, "name": name
        }
        if concurrent_context:
            concurrent_context: ConcurrentContext
            concurrent_context.new(Department, **kwargs)
        else:
            return Department(**kwargs)


query = Department()

select = query.select


def startswith(start: str):
    if is_valid_input(start):
        return select(name=Like(f"{start}%"))
    return ModelGroup.empty()


def exists(department):
    if isinstance(department, str):
        return name_exists(department)
    elif isinstance(department, int):
        return id_exists(department)
    else:
        raise Exception("Invalid data type")


def name_exists(department_name: str):
    return select(name=department_name)


def id_exists(department_id: int):
    return select(id=department_id)


def all():
    return select()
