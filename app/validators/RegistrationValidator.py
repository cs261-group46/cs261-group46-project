from cerberus import Validator

# data_dict.get("first_name"),
# data_dict.get("last_name"),
# data_dict.get("department"))


#
# class RegistrationValidator(Validator):
#     def _validate_are_equal(self, password, field, password_repeat):
#         """ Test password and password_repeat are the same.
#
#         The rule's arguments are validated against this schema:
#         {'type': 'string'}
#         """
#         if password not in self.document:
#             return False
#
#         if self.document[password] != password_repeat:
#             self._error(field, "Passwords don't match")
#

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
        'regex': '(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)',    # TODO: Create regex for it (https://stackoverflow.com/questions/1559751/regex-to-make-sure-that-the-string-contains-at-least-one-lower-case-char-upper)
        'required': True,
        'minlength': 10,
        'maxlength': 126
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

validator = Validator(validationRules)
