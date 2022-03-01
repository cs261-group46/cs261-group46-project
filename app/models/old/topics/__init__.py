from app.models.utils.fake_alchemy import Model, ModelGroup, Column, ColumnType, Serial, Text, VarChar
from app.models.utils.fake_alchemy.filter_types import Like
from app.sql import is_valid_input
from app.utils import ConcurrentContext


class Topic(Model):
    __tablename__ = "topics"

    # id = Column(Serial, primary_key=True)
    # name = Column(VarChar(128), unique=True)

    def __repr__(self):
        return f"Topic [{self.id}, {self.name}]"

    def convert_to_data_type(self, row: list, concurrent_context=None):
        databaseID, name = row

        kwargs = {
            "id": databaseID, "name": name
        }
        if concurrent_context:
            concurrent_context: ConcurrentContext
            concurrent_context.new(Topic, **kwargs)
        else:
            return Topic(**kwargs)


query = Topic()

select = query.select


def startswith(start: str):
    if is_valid_input(start):
        return select(name=Like(f"{start}%"))
    return ModelGroup.empty()


def exists(topic):
    if isinstance(topic, str):
        return name_exists(topic)
    elif isinstance(topic, int):
        return id_exists(topic)
    else:
        raise Exception("Invalid data type")


def name_exists(topic_name: str):
    return select(name=topic_name)


def id_exists(topic_id: int):
    return select(id=topic_id)


def all():
    return select()
