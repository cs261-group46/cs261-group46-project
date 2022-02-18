import os


def load():
    if "SECRET_KEY" in os.environ.keys():
        return os.environ
    else:
        return {"SECRET_KEY":"va_tLgio5_XvHQ1MTXqn_geISuIBxkctGw3Fmz7cwutYAxq0Xl7twJQAXl£XShE3T8JjWPQCXbSgTXdoV39VMmiSt9ybQ", "PEPER":"B1a5KEbbMThr2Klsat2XUyZWXegayfq9"}

def get(key: str):
    return load().get(key)