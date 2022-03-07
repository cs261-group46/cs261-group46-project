from cerberus import Validator


storeValidationRules = {
    'mentor': {
        'type': 'integer',
        'required': True,
    },
    'mentee': {
        'type': 'integer',
        'required': True,
    },

}

updateValidationRules = {
    'accepted': {
        'type': 'boolean',
        'required': True,
    },
}

storeValidator = Validator(storeValidationRules)
updateValidator = Validator(updateValidationRules)