
class Filter:
    def get_sql(self, column_name, column_type):
        raise NotImplementedError


class Like(Filter):
    def __init__(self, compare_string):
        self.compare_string = compare_string

    def get_sql(self, column_name, column_type):
        if column_type.is_string():
            return f"{column_name} LIKE '{self.compare_string}'"
        return f"{column_name} LIKE {self.compare_string}"