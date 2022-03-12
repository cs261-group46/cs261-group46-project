from cerberus import Validator

loginValidationRules = {
    'email': {
        'type': 'string',
        'regex': '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
        'required': True,
        'minlength': 5,
        'maxlength': 126
    },
    'password': {
        'type': 'string',
        'required': True
    },
}

registerValidationRules = {
    'email': {
        'type': 'string',
        'regex': '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
        'required': True,
        'minlength': 5,
        'maxlength': 126
    },
    'password': {
        'type': 'string',
        # 'regex': '(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)',    # TODO: Create regex for it (https://stackoverflow.com/questions/1559751/regex-to-make-sure-that-the-string-contains-at-least-one-lower-case-char-upper)
        # 'regex': '',    # TODO: Create regex for it (https://stackoverflow.com/questions/1559751/regex-to-make-sure-that-the-string-contains-at-least-one-lower-case-char-upper)
        'required': True,
        'minlength': 10,
        'maxlength': 126
    },
    'first_name': {
        'type': 'string',
        'required': True,
        'maxlength': 126
    },
    'last_name': {
        'type': 'string',
        'required': True,
        'maxlength': 126
    },
    'department': {
        'type': 'dict',
        'schema': {
            'id': {
                'type': 'integer',
                'required': True
            },
            'name': {
                'type': 'string',
                'required': False
            }
        },
        'required': True,
        'min': 1
    }
}

loginValidator = Validator(loginValidationRules)
registerValidator = Validator(registerValidationRules)
