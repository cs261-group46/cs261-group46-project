from FileManager import read_file


def read(table_name: str, data_structure: list[str]) -> dict[str: list[str]]:
    file = read_file("data", table_name + ".csv")

    r_data = {}

    for r, row in enumerate(file.split("\n")):
        columns = row.split(",")
        skip = False
        for column in columns:
            if not column:
                skip=True
        if not skip:
            for c, value in enumerate(columns):
                column_name = data_structure[c]
                if (r_data_column := r_data.get(column_name)) is None:
                    r_data_column = r_data[column_name] = []
                r_data_column.append(value)

    return r_data


