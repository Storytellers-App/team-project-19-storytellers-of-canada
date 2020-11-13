import mysql.connector
from config import Config
from common.Enums import UserType 

# Class for handling registration
class RegisterService:

    def register(self, name, email, username, password):
        try:
            # Creating a connection
            conn = mysql.connector.connect(
                user = Config.SQL_USERNAME, 
                password = Config.SQL_PASSWORD, 
                host = Config.SQL_HOST, 
                database=Config.SQL_DB
                )
            cursor = conn.cursor(buffered=True)
            # Inserting the new user
            query = "INSERT INTO Users (username, password, name, email, authToken, type) VALUES (%s, %s, %s, %s, %s, %s)"
            authToken = username + "AUTH"
            values = (username, password, name, email, authToken, UserType.MEMBER.value)
            cursor.execute(query, values)
            conn.commit()
            return True
        except:
            return False