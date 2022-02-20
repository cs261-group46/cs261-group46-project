from cerberus import Validator

# data_dict.get("first_name"),
# data_dict.get("last_name"),
# data_dict.get("department"))



class RegistrationValidator(Validator):
    def _validate_are_equal(self, password, field, password_repeat):
        if password != password_repeat:
            self._error(field, "Passwords don't match")


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
        'regex': '',    # TODO: Create regex for it
        'required': True,
        'minlength': 10,
        'maxlength': 126
    },
    'password_repeat': {
        'type': 'string',
        'required': True,
        'dependencies': 'password',
        'are_equal': 'password'
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
        'type': 'integer',
        'required': True,
        'min': 1
    }

}

validator = RegistrationValidator(validationRules)
