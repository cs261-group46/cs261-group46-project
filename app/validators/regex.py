from cerberus import Validator
from app.sql import is_valid_input

email = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
password = "^[a-zA-Z0-9_.+-]"    # TODO: Create regex for it


class SQLValidator(Validator):
    def _validate_valid_sql(self, constraint, field, value):
        """ Test if a value can enter the database.

        The rule's arguments are validated against this schema:
        {'type': 'boolean'}
        """

        if constraint is True:
            if not is_valid_input(value):
                self._error(field, "Invalid SQL")
