from cerberus import Validator

updateValidationRules = {
    'score': {
        'required': True,
        'type': 'integer',
        'min': 1,
        'max': 5
    },
    'feedback': {
        'minlength': 1,
        "maxlength": 1000,
        'required': True,
        'type': 'string',
    },
    "mentor_id": {
        "required": True,
        "type": "integer",
        "min": 1

    }

}

updateValidator = Validator(updateValidationRules)
