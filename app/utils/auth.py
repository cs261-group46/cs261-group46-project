from datetime import datetime, timedelta

def get_login_token_timeout():
    return datetime.utcnow() + timedelta(minutes=30)
