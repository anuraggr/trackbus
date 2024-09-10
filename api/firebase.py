import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("file.json")

firebase_admin.initialize_app(cred, {"databaseURL" : "https://driverapp-47cd8-default-rtdb.firebaseio.com/"})
