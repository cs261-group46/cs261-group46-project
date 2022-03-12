from flask_mail import Message
from api.app import mail

def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender='from@example.com'
    )

    mail.send(msg)
