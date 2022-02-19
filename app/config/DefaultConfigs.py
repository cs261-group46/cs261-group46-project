configs_to_load = {
    "sql": {
        "connection": {
            "host": "localhost",
            "port": "5432",
            "database": "cs261",
            "user": "user",
            "password": ""
        },
        "sql_files": [
            "01_declaratives.sql",
            "02_permissions.sql",
            "03_users.sql",
            "04_mentors_mentees.sql",
            "05_notifications.sql",
            "06_user_login_tokens.sql"
        ]
    },
    "email": {
        "email_server": {
            "server": "",
            "port": 0,
            "use_tls": False,
            "username": "",
            "password": ""
        },
        "use_email_notifications": False,
        "enabled": False,
        "sender": ""
    }
}
