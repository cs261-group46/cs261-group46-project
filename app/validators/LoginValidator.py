from cerberus import Validator

validationRules = {
    'email': {
        'type': 'string',
        'regex': '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
        'required': True,
        'minlength': 5,
        'maxlength': 126
    },
    'password': {
        'type': 'string',
        # 'regex': '',    TODO: Create regex for it
        'required': True,
        'minlength': 10,
        'maxlength': 126
    },
}

validator = Validator(validationRules)
