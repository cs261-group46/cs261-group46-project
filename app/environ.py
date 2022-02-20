import os


def load():
    return {
        "SECRET_KEY": "va_tLgio5_XvHQ1MTXqn_geISuIBxkctGw3Fmz7cwutYAxq0Xl7twJQAXl£XShE3T8JjWPQCXbSgTXdoV39VMmiSt9ybQ",
        # "PEPER": "B1a5KEbbMThr2Klsat2XUyZWXegayfq9",
        # "HOST_URL": "https://www.skillquest.com",
        "NAME": "SkillQuest",
        "DATABASE_USER": "postgres",
        "DATABASE_PASSWORD": "wcfqcNNgp4vk",
        "DATABASE_NAME": "cs261",
    }


def get(key: str):
    return load().get(key)
