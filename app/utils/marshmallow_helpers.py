from app import ma
from app.utils.request import parse_args_list


def respect_more_delimiters(initial_result, fields):
    if initial_result is None:
        return None

    if fields is None:
        return initial_result

    result_transformed = {}
    finished_fields = []

    for field in fields:
        if field in finished_fields:
            continue

        parts = field.split(".")
        d = result_transformed
        r = initial_result

        for count, part in enumerate(parts[:-1]):
            if part not in d and part in r:
                if r[part] is None:
                    d[part] = None
                else:
                    d[part] = [] if isinstance(r[part], list) else {}

            if part in r and not d[part] is None:
                d, r = d[part], r[part]
            else:
                break

            if isinstance(r, list):
                relevant_fields = [".".join(field.split(".")) for field in fields if field.split(".")[count] == part]
                finished_fields.extend(relevant_fields)
                new_fields = [".".join(field.split(".")[count+1:]) for field in relevant_fields if field.split(".")[count] == part]

                for subpart in r:
                    q = respect_more_delimiters(subpart, new_fields)
                    d.append(q)
                break

        if parts[-1] in r:
            d[parts[-1]] = r[parts[-1]]

    return result_transformed


def get_results(Schema : ma.SQLAlchemySchema, model, exclude=None):
    if exclude is None:
        exclude = []

    fields = parse_args_list("fields")
    if fields is None or (len(fields) == 1 and fields[0] == ''):
        fields = None

    fieldsCut = None
    if not fields is None:
        fieldsCut = [".".join(field.split(".")[:2]) for field in fields]

    if fieldsCut is None:
        schema = Schema(exclude=exclude)
    else:
        schema = Schema(only=fieldsCut, exclude=exclude)

    return respect_more_delimiters(schema.dump(model), fields)

