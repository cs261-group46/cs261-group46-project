from itsdangerous.url_safe import URLSafeTimedSerializer as TimedSerializer
from itsdangerous.url_safe import URLSafeSerializer as Serializer
from uuid import UUID


def create_reset_token(secret_key, id: UUID):
    data = {"user_id":str(id), "type": "password_reset"}
    s = TimedSerializer(secret_key+"reset")
    return s.dumps(data)


def create_validation_token(secret_key, id: UUID):
    data = {"user_id":str(id), "type": "account_verify"}
    s = Serializer(secret_key+"validation")
    return s.dumps(data)


def verify_reset_token(secret_key, token):
    s = TimedSerializer(secret_key+"reset")
    return s.loads(token, max_age=300)


def verify_validation_token(secret_key, token):
    s = Serializer(secret_key+"validation")
    return s.loads(token)

