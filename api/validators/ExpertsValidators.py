from cerberus import Validator

updateValidationRules = {
    'expertises': {
        'required': True,
        'type': 'list',
        'minlength': 1,
        'schema': {
            "type": "integer",
            "min": 1,
            'required': True
        }

    },
}

storeValidationRules = {
    'user_id': {
        'required': True,
        'type': 'integer',
        'min': 1
    },
    'expertises': {
        'required': True,
        'type': 'list',
        'minlength': 1,
        'schema': {
            "type": "integer",
            "min": 1,
            'required': True
        }

    },
}

storeValidator = Validator(storeValidationRules)
updateValidator = Validator(updateValidationRules)
