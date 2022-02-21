from cerberus import Validator
import app.validators.regex as regex

validationRules = {
    'email': {
        'type': 'string',
        'regex': regex.email,
        'required': True,
        'minlength': 5,
        'maxlength': 126,
        "valid_sql": True
    },
    'password': {
        'type': 'string',
        'regex': regex.password,
        'required': True,
        'minlength': 10,
        'maxlength': 126
    },
}

validator = regex.SQLValidator(validationRules)
