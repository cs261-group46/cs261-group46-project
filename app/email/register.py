import app.email as email
import app.environ as environ
Mail = email.EMail


VERIFY = Mail("verify", f"[{environ.get('NAME')}] Account signup", "Verify.html",
              name=environ.get("NAME"), url_root=environ.get("HOST_URL"))
RESET  = Mail("reset_password", f"[{environ.get('NAME')}] Password Reset", "Reset.html")
