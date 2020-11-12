import mysql.connector
from config import Config

# Class for handling DB access
class LoginService:

    # Getting an auth token given a username and password
    def getAuthToken(self, username, password):
        authToken = -1        
        # Creating a connection
        conn = mysql.connector.connect(
            user = Config.SQL_USERNAME, 
            password = Config.SQL_PASSWORD, 
            host = Config.SQL_HOST, 
            database=Config.SQL_DB
            )
        cursor = conn.cursor(buffered=True)
        # Checking validity
        query = f"SELECT authToken FROM Users WHERE username='{username}' AND password='{password}';"
        cursor.execute(query)
        if cursor.rowcount > 0:
            result = cursor.fetchone()
            authToken = result[0]
        cursor.close()
        conn.close()
        # Returning the authToken
        return authToken
