from flask_restful import Resource, reqparse, abort, fields, marshal_with, \
    marshal
from extensions import db
from models import VerificationCode, User
from sqlalchemy.exc import *
import sqlalchemy
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import ssl

# Class for handling registration


class EmailVerificationService:

    def validate(self, emailInput, validationTokenInput):
        """
        Check to see that the token is correct given an email
        """
        try:
            code = VerificationCode.query.filter_by(email=emailInput).first()
            valid = code.code == validationTokenInput

            if valid:
                # Delete the code
                try:
                    VerificationCode.query.filter_by(email=emailInput).delete()
                    db.session.commit()
                except Exception as e:
                    print(e)
                    return False

                # Update the user object
                try:
                    temp_user = self.getUser(code.email)
                    temp_user.isActive = True
                    db.session.commit()
                except Exception as e:
                    print(e)
                    return False

            return valid
        except Exception as e:
            print(e)
            return False

    def validateWithoutEmail(self, username, token):
        """
        Check to see that the token is correct given a username and no email
        """
        try:
            user = self.getUserWithUsername(username)
            email = user.email
            return self.validate(email, token)
        except Exception as e:
            print(e)
            return False

    def getUser(self, email):
        """
        Get a user object with their email
        """
        try:
            # Getting user's auth token information if it exists
            for user in db.session.query(User).filter_by(email=email):
                return user
            return False
        except:
            return False

    def getUserWithUsername(self, username):
        """
        Get a user object with the username
        """
        try:
            # Getting user's auth token information if it exists
            for user in db.session.query(User).filter_by(username=username):
                return user
            return False
        except:
            return False

    def validate_new_email(self, email, name):
        """
        Send an email to the user to validate their email
        """
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
        self.send_email(email, code, email_message)

    def send_password_reset_email(self, email):
        """
        Send a password reset email to the user
        """
        # Check to see if its a valid email
        user = self.getUser(email)
        if not user:
            return False

        # User is valid, generate the email then send it
        # code = randint(100000, 999999)
        code = 999999
        email_message = "Hello " + ",\nYou recently requested to reset your password" + """
If this wasn't you, please do nothing at this time

Please enter this one time code in the app to reset your password
""" + str(code) + """
\nThanks,

Storytellers of Canada
        """

        self.send_email(email, code, email_message)
        return True

    def send_email(self, reciever, code, email_message):
        try:
            verification_code = VerificationCode(email=reciever,
                                                 code=str(code))
            db.session.add(verification_code)
            db.session.commit()

            # Now send the email
            # https://www.tutorialspoint.com/send-mail-from-your-gmail-account-using-python
            sender_email = 'kirksmith.john@gmail.com'
            message = MIMEMultipart()
            message['From'] = sender_email
            message['To'] = reciever
            message['Subject'] = 'Welcome to Storytellers of Canada'
            message.attach(MIMEText(email_message, 'plain'))

            # Create SMTP session for sending the mail
            # session = smtplib.SMTP('smtp.gmail.com', 587)  # use gmail with port
            # session.starttls()  # enable security
            # session.login(sender_email, 'PureStandardProducts1')
            # text = message.as_string()
            # session.sendmail(sender_email, email, text)
            # session.quit()
        except Exception as e:
            print(e)
