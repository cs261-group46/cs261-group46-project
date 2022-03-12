from cerberus import Validator

storeValidationRules = {
    'user_id': {
        'required': True,
        'type': 'integer',
        'min': 1
    },
    'about': {
        'type': 'string',
        'required': True,
        'minlength': 1,
        'maxlength': 1000
    },
    'capacity': {
        'type': 'integer',
        'required': True,
        'min': 1,
        'max': 100
    },
    'skills': {
        'type': 'list',
        'minlength': 1,
        'maxlength': 10,
        'required': True,
        'schema': {
            'type': "dict",
            'schema': {
                "skill": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                },
                "priority": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                }
            }
        }
    }

}

updateValidationRules = {
    'skills': {
        'type': 'list',
        'minlength': 1,
        'maxlength': 10,
        'required': True,
        'schema': {
            'type': "dict",
            'schema': {
                "skill": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                },
                "priority": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                }
            }
        }
    }
}

storeValidator = Validator(storeValidationRules)
updateValidator = Validator(updateValidationRules)
