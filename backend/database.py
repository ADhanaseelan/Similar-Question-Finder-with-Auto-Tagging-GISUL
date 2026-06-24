import firebase_admin
from firebase_admin import credentials, db
from config import settings
import os

def connect_db():
    key_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
    if not os.path.exists(key_path):
        print("[WARNING] serviceAccountKey.json is missing! Firebase will not initialize correctly.")
        return

    if not firebase_admin._apps:
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred, {
            'databaseURL': settings.FIREBASE_DB_URL
        })
        print("[DB] Connected to Firebase Realtime Database")

def close_db():
    pass

def get_db():
    """Dependency for getting the database instance."""
    return db
