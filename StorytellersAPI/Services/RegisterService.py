from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from extensions import db
from models import User, VerificationCode
from sqlalchemy.exc import *
import smtplib
import ssl
from random import randint
from uuid import uuid4
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# Class for handling registration
class RegisterService:

    def register(self, nameInput, emailInput, usernameInput, passwordInput):
        try:
            # Generating a new auth token
            newAuth = uuid4()
            user = User(username=usernameInput,
                password=passwordInput,
                name=nameInput,
                email=emailInput,
                authToken=str(newAuth),
                isActive=False)

            # Adding this new user to the DB
            db.session.add(user)
            db.session.commit()
            self.validate_email(emailInput, nameInput)
            return True
        except Exception as e:
            print(e)
            return False

    def validate_email(self, email, name):
        # TODO: Switch this back once we have a domain name
        # code = randint(100000, 999999)
        code = 999999
        email_message = "Dear " + name + ",\nWelcome to storytellers of Canada." + """
We are very happy that you could join us.
        
Please enter this one time code to validate your email.
""" + str(code) + """
Thanks,
        
Storytellers of Canada
"""
        print("Validation code is" + str(code))
        try:
            verification_code = VerificationCode(email=email, code=str(code))
            db.session.add(verification_code)
            db.session.commit()

            # Now send the email
            # https://www.tutorialspoint.com/send-mail-from-your-gmail-account-using-python
            sender_email = 'kirksmith.john@gmail.com'
            message = MIMEMultipart()
            message['From'] = sender_email
            message['To'] = email
            message['Subject'] = 'Welcome to Storytellers of Canada'
            message.attach(MIMEText(email_message, 'plain'))

            # Create SMTP session for sending the mail
            session = smtplib.SMTP('smtp.gmail.com', 587)  # use gmail with port
            session.starttls()  # enable security
            session.login(sender_email, 'PureStandardProducts1')
            text = message.as_string()
            session.sendmail(sender_email, email, text)
            session.quit()
        except Exception as e:
            print(e)




