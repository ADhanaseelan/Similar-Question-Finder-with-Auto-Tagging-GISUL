import firebase_admin
from firebase_admin import credentials, db
from config import settings
import os
import json

def connect_db():
    if firebase_admin._apps:
        return
        
    cred = None
    
    # 1. Try to load from environment variable (for Hugging Face Spaces Production)
    env_creds = os.environ.get("FIREBASE_CREDENTIALS")
    if env_creds:
        try:
            cred_dict = json.loads(env_creds)
            cred = credentials.Certificate(cred_dict)
            print("[DB] Loaded Firebase credentials from Environment Variable.")
        except Exception as e:
            print(f"[ERROR] Failed to parse FIREBASE_CREDENTIALS: {e}")
            
    # 2. Fallback to local file (for local development)
    if not cred:
        key_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            print("[DB] Loaded Firebase credentials from serviceAccountKey.json.")
        else:
            print("[WARNING] No Firebase credentials found! Firebase will not initialize.")
            return

    # Initialize the app
    firebase_admin.initialize_app(cred, {
        'databaseURL': settings.FIREBASE_DB_URL
    })
    print("[DB] Connected to Firebase Realtime Database")

def close_db():
    pass

def get_db():
    """Dependency for getting the database instance."""
    return db
