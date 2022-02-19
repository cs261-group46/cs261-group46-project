configs_to_load = {"sql":
                       {"connection":
                            {"host": "localhost",
                             "port": "5432",
                             "database": "cs261",
                             "user": "user",
                             "password": ""
                             },
                        "sql_files":
                            ["schema.sql"]
                        },
                   "email":
                       {"email_server":
                               {"server": "",
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