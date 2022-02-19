from flask import Flask, render_template
from flask_mail import Mail, Message


class EMail:
    app_mail = None
    sender: str
    enabled = False
    emails = {}
    debug = False

    def __init__(self, mail_type: str, subject: str, template_name: str, **kwargs):
        self.mail_type = mail_type
        self.subject = subject
        self.template_name = template_name
        self.base_kwargs = kwargs

        EMail.emails[mail_type] = self

    def prepare(self, recipients: list, **kwargs):
        msg = Message(self.subject, sender=self.sender, recipients=recipients)
        body = render_template(f"emails/body/{self.template_name}", **kwargs, **self.base_kwargs)
        html = render_template(f"emails/html/{self.template_name}", **kwargs, **self.base_kwargs)

        msg.body = body
        msg.html = html
        return msg

    def send(self, recipients: list, **kwargs):
        msg = self.prepare(recipients, **kwargs)
        if (not EMail.enabled) or EMail.debug:
            print(f"Sending {self!r} to {recipients} with arguments {kwargs}")
        else:
            EMail.app_mail.send(msg)

    def __repr__(self):
        return f"Email({self.mail_type} {self.subject})"

    @staticmethod
    def main(enabled: bool, app: Flask, sender: str):
        EMail.enabled = enabled
        EMail.app_mail = Mail(app)
        EMail.sender = sender


import app.email.register as Register
