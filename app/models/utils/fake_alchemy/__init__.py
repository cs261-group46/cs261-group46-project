from app.sql import conn
from app import db
from app.utils import ConcurrentContext

from app.models.utils.fake_alchemy.ColumnTypes import ColumnType, column_type_builder
from app.models.utils.fake_alchemy.ColumnTypes import Integer, Text, VarChar, Boolean, Timestamp, UUID
from app.models.utils.fake_alchemy.ColumnTypes import Serial, Reference, Ref


class Column:
    def __init__(self, type: ColumnType, default=None, primary_key=False, unique=False, nullable=True):
        self.type, self.default = type, default
        self.primary_key = primary_key
        self.unique = unique
        self.nullable = nullable
        if isinstance(type, Ref):
            self.foreign_key = True
        else:
            self.foreign_key = False
        self._name = None

    def set_name(self, name):
        self._name = name

    def get_sql_eq(self, value):
        return self.type.get_sql_eq(self._name, value)

    def validate(self, value):
        self.type.validate(value)

    def __repr__(self):
        return f"Column(name={self._name}, type={self.type})"


class Schema:
    schemas = {}

    def __new__(cls, model_class):
        model_name = getattr(model_class, "__tablename__")
        # model_name = model_class
        if (schema := Schema.schemas.get(model_name)) is None:
            Schema.schemas[model_name] = schema = super().__new__(cls)
        return schema

    def __init__(self, model_class):
        self.columns = {}
        self.primary_key = None
        self.name = getattr(model_class, "__tablename__")

        for dir in model_class.__dir__():
            attr = getattr(model_class, dir)
            if isinstance(attr, Column):
                self.columns[dir] = attr
                attr.set_name(dir)
                if attr.primary_key:
                    if self.primary_key:
                        raise Exception("At the moment, only one column is allowed for primary keys")
                    self.primary_key = dir

    def raw_eq(self, arg_name: str, value):
        if (col := self.columns.get(arg_name)) is None:
            raise Exception(f"{arg_name} is not an attribute of {self.name}")
        return col.get_sql_eq(value)

    def __repr__(self):
        s = f"Schema(name={self.name} "
        for col_name, col in self.columns.items():
            col_type = col.type
            s += f"{repr(col)} "
        return s + ")"


class Model:
    def __init__(self, **kwargs):
        self.schema = Schema(self)
        self.values = kwargs

        for name, value in self.values.items():
            setattr(self, name, value)



    @staticmethod
    def get_schema(model) -> Schema:
        return Schema.schemas.get(getattr(model, "__tablename__"))

    def build_where_elements(self, **kwargs):
        return [self.get_eq(arg_name, value) for arg_name, value in kwargs.items()]

    def build_where(self, **kwargs):
        statement_where = " AND ".join(self.build_where_elements(**kwargs))
        if len(statement_where) > 0:
            return f" WHERE {statement_where}"
        return ""

    def get_eq(self, arg_name, value) -> str:
        return self.schema.raw_eq(arg_name, value)

    def convert_to_data_type(self, row: list, concurrent_context=None):
        raise NotImplementedError

    def compile_data(self, data, concurrent_context=False):
        compiling_data = []
        if concurrent_context:
            context = ConcurrentContext()
            for row in data:
                compiling_data.append(self.convert_to_data_type(row, concurrent_context=context))
        else:
            for row in data:
                compiling_data.append(self.convert_to_data_type(row))
        return ModelGroup(*compiling_data)

    def select(self, concurrent_context=False, **kwargs):
        statement = f"SELECT * FROM {self.schema.name}{self.build_where(**kwargs)};"
        print(statement)
        return self.compile_data(execute_statement(statement), concurrent_context=concurrent_context)

    def delete(self, **kwargs):
        statement = f"DELETE FROM {self.schema.name}{self.build_where(**kwargs)};"
        print(statement)
        # execute_statement(statement)

    def get_data(self) -> dict:
        r_data = {}
        for col_name, col in self.schema.columns.items():
            if (value := self.values.get(col_name)) is None:
                if col.default:
                    value = col.default()
                elif not col.nullable:
                    raise Exception(f"Column{col_name} needs a value, but does not have one")
            else:
                if not col.validate(value):
                    raise TypeError("Invalid data type")
            if value:
                r_data[col_name] = value
        return r_data

    def get_loaded(self) -> dict:
        r_data = {}
        for col_name, col in self.schema.columns.items():
            if (value := self.values.get(col_name)) is not None:
                if not col.validate(value):
                    raise TypeError("Invalid data type")
            if value:
                r_data[col_name] = value
        return r_data

    def build_set(self, **kwargs):
        parts = []
        for col_name, value in kwargs.items():
            col = self.schema.columns[col_name]
            if col.type.is_string():
                parts.append(f"{col_name}='{value}'")
            else:
                parts.append(f"{col_name}={value}")

        return ", ".join(parts)

    def build_insert_into(self, **kwargs):
        col_names = []
        values = []
        for col_name, value in kwargs.items():
            col = self.schema.columns[col_name]
            col_names.append(f"{col_name}")
            if col.type.is_string():
                values.append(f"'{value}'")
            else:
                values.append(f"{value}")

        return ", ".join(col_names), ", ".join(values)

    def update(self, **kwargs):
        loaded = self.get_loaded()
        statement = f"UPDATE {self.schema.name} SET {self.build_set(**loaded)}{self.build_where(**kwargs)};"
        print(statement)

    def insert(self):
        col_names, values = self.get_data()
        statement = f"INSERT INTO {self.schema.name}({col_names}) VALUES (values);"
        print(statement)


class ModelGroup:
    def __init__(self, *instances):
        self.instances = instances

    def first(self):
        if self.instances:
            return self.instances[0]
        else:
            return None

    def __getitem__(self, item):
        return self.instances[item]

    def __iter__(self):
        return ModelGroupIterator(self)

    def __len__(self):
        return len(self.instances)

    def is_empty(self):
        return self.first() is None

    @staticmethod
    def empty():
        return ModelGroup()


class ModelGroupIterator:
    def __init__(self, model_group: ModelGroup):
        self.model_group = model_group
        self.n = 0

    def __next__(self):
        if self.n < len(self.model_group):
            return self.model_group.instances[self.n]
        else:
            raise StopIteration


def execute_statement(statement) -> tuple[list]:
    cursor = db.cursor()
    cursor.execute(statement)
    return cursor.fetchall()
