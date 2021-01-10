from flask_restful import Resource, reqparse, abort, fields, marshal_with, marshal
from extensions import db
from models import VerificationCode, User
from sqlalchemy.exc import *
import sqlalchemy
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import ssl
from random import randint
from Services.GetUserService import GetUserService
from Services.instance.config import *
import json
from extensions import db
from models import Story, Like, Comment


class GDPRService:
    def get_user_data(self, user):
        message = "User: \n"
        message = message + json.dumps(user.__dict__, indent=2) + "\n"

        message = message + "Stories: \n"
        for story in db.session.query(Story).filter_by(username=user.username):
            message = message + json.dumps(story.__dict__, indent=2) + "\n"

        message = message + "Likes: \n"
        for like in db.session.query(Like).filter_by(username=user.username):
            message = message + json.dumps(like.__dict__, indent=2) + "\n"

        message = message + "Comments: \n"
        for comment in db.session.query(Comment).filter_by(username=user.username):
            message = message + json.dumps(comment.__dict__, indent=2) + "\n"

        return message

    def send_gdpr_email(self, user, email):
        message = self.get_user_data(user)
        self.send_email(email, message)
        return True

    def send_email(self, receiver, email_message):
        try:
            # Now send the email
            # https://www.tutorialspoint.com/send-mail-from-your-gmail-account-using-python
            sender_email = "radioapp@storytellers-conteurs.ca"
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = receiver
            message["Subject"] = "GDPR/CCPA request data from Storytellers of Canada"
            message.attach(MIMEText(email_message, "plain"))

            # Create SMTP session for sending the mail
            session = smtplib.SMTP("mail.storytellers-conteurs.ca", 587)
            session.starttls()  # enable security
            session.login(sender_email, verification_pw)
            text = message.as_string()
            session.sendmail(sender_email, receiver, text)
            session.quit()
        except Exception as e:
            print(e)
