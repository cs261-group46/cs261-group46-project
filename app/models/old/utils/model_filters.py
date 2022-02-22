from app.models.utils.fake_alchemy import Model, Column, ColumnType, Serial, Text, VarChar, Timestamp, Reference, \
    Boolean, Integer, UUID, ModelGroup


def get_user_filters(column_name: str):
    class UserFilters(Model):
        def convert_to_data_type(self, row: list, concurrent_context=None):
            raise NotImplementedError

        def get_eq(self, arg_name, value) -> str:
            match arg_name:
                case "login_token" | "loginToken":
                    return f"{column_name}=get_user_id_from_token('{value}', 'LOGIN')"
                case "password_reset_token" | "passwordResetToken":
                    return f"{column_name}=get_user_id_from_token('{value}', 'PASSWORD_RESET')"
                case "email_verify_token" | "emailVerifyToken":
                    return f"{column_name}=get_user_id_from_token('{value}', 'EMAIL_VERIFY')"
                case _:
                    return super().get_eq(arg_name, value)

    return UserFilters