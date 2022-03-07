from cerberus import Validator


def get_errors(Validator : Validator):
    es = []
    for input_name, errors in Validator.errors.items():
        for error in errors:
            es.append(f'{input_name} {error}')

    return es
