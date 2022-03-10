from cerberus import Validator

updateValidationRules = {
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

updateValidator = Validator(updateValidationRules)
