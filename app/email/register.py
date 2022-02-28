from app import NAME, HOST_URL
from app.email import EMail as Mail


VERIFY = Mail("verify", f"[{NAME}] Account signup", "Verify.html", name=NAME, url_root=HOST_URL)
RESET  = Mail("reset_password", f"[{NAME}] Password Reset", "Reset.html")
