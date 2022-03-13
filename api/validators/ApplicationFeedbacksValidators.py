from cerberus import Validator

storeValidationRules = {
    'feedback': {
        'minlength': 1,
        "maxlength": 1000,
        'required': True,
        'type': 'string',
    },
    "user_id": {
        "required": True,
        "type": "integer",
        "min": 1
    },
}

storeValidator = Validator(storeValidationRules)
