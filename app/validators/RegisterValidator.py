import app.validators.regex as regex


class RegistrationValidator(regex.SQLValidator):
    def _validate_are_equal(self, password, field, password_repeat):
        """ Test password and password_repeat are the same.

        The rule's arguments are validated against this schema:
        {'type': 'string'}
        """
        if password != password_repeat:
            self._error(field, "Passwords don't match")


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
    'password_repeat': {
        'type': 'string',
        'required': True,
        'dependencies': 'password',
        'are_equal': 'password'
    },
    'first_name': {
        'type': 'string',
        'required': True,
        'maxlength': 126,
        "valid_sql": True
    },
    'last_name': {
        'type': 'string',
        'required': True,
        'maxlength': 126,
        "valid_sql": True
    }
}

validator = RegistrationValidator(validationRules)