import datetime
import uuid

from app.models.utils.fake_alchemy.filter_types import Filter

class ColumnType:
    def __init__(self, name: str, python_type: type, allow_value=True, base_type=None, is_string=False):
        self.name = name
        self._is_string = is_string
        if base_type is None:
            self._base_type = self
        else:
            self._base_type = base_type

        self.python_type = python_type

    def get_sql(self, *args):
        return self.name

    def get_sql_column_type(self):
        return self._base_type

    def is_base_type(self):
        return self == self._base_type

    def is_string(self):
        return self._is_string

    def display_name(self):
        return self.name

    def __repr__(self):
        if self.is_base_type():
            return f"ColumnType(name={self.display_name()}, sql_type={self.display_name()}"
        else:
            return f"ColumnType(name={self.display_name()}, sql_type={self._base_type}"

    def get_sql_eq(self, column_name, value):
        if isinstance(value, Filter):
            return value.get_sql(column_name, self)
        else:
            if self.is_string():
                return f"{column_name}='{value}'"
            return f"{column_name}={value}"

    def validate(self, value) -> bool:
        if self.python_type == None:
            raise Exception("Invalid type, but as none expected, it is possibled you tried to assign to a defaulting value")
        return isinstance(value, self.python_type)


def column_type_builder(column_type, **kwargs):
    def run(*args):
        return column_type(*args, **kwargs)
    return run


class VarChar(ColumnType):
    def __init__(self, length):
        super().__init__("varchar", str)
        self.length = length
        #super(VarChar, self).__init__()

    def getSQL(self):
        return f"{self.name}({self.length})"

    def validate(self, value) -> bool:
        return isinstance(value, self.python_type) and len(value) <= self.length

    def display_name(self):
        return f"{self.name}({self.length})"


class Ref(ColumnType):
    def __init__(self, model_type, **kwargs):
        super().__init__("ref", int, **kwargs)
        # model_name = getattr(model_type, "__tablename__")  # print(model.__name__, getattr(model, "__tablename__"))

        self.schema = model_type.get_schema(model_type)

    def getSQL(self, column_name):
        sb1, sb2 = "", ""
        key: str
        for key, col in self.table.primary_key.items():
            sb1 += f"{column_name}_{key} {col.type.getSQL()}\n"

        return sb1, sb2

    def get_sql_column_type(self):
        return self.schema.columns[self.schema.primary_key].type.get_sql_column_type()


Integer = ColumnType("integer", int)
Text = ColumnType("text", str, is_string=True)
Boolean = ColumnType("boolean", bool)
Real = ColumnType("real", float)
Varchar = column_type_builder(VarChar, is_string=True)
Timestamp = ColumnType("timestamp", datetime.datetime)
UUID = ColumnType("uuid", uuid.UUID, is_string=True)

Serial = ColumnType("serial", None, allow_value=False, base_type=Integer)
Reference = column_type_builder(Ref, base_type=Integer)

