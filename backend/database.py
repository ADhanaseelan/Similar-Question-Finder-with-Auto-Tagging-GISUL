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
            print(f"[DB DIAGNOSTICS] FIREBASE_CREDENTIALS env var length: {len(env_creds) if env_creds else 0}")
            cred_dict = json.loads(env_creds)
            if "private_key" in cred_dict:
                pk = cred_dict["private_key"]
                print(f"[DB DIAGNOSTICS] Raw private_key type: {type(pk)}")
                if isinstance(pk, str):
                    print(f"[DB DIAGNOSTICS] Raw private_key length: {len(pk)}")
                    print(f"[DB DIAGNOSTICS] Raw private_key starts with BEGIN: {pk.startswith('-----BEGIN PRIVATE KEY-----')}")
                    print(f"[DB DIAGNOSTICS] Raw private_key ends with END: {pk.strip().endswith('-----END PRIVATE KEY-----')}")
                    print(f"[DB DIAGNOSTICS] Raw private_key contains \\\\n: {pk.count('\\\\n')}")
                    print(f"[DB DIAGNOSTICS] Raw private_key contains \\n: {pk.count('\\n')}")
                    print(f"[DB DIAGNOSTICS] Raw private_key contains actual newlines: {pk.count(chr(10))}")
                    
                    # Clean up the key
                    pk_clean = pk.strip()
                    if pk_clean.startswith('"') and pk_clean.endswith('"'):
                        pk_clean = pk_clean[1:-1].strip()
                    if pk_clean.startswith("'") and pk_clean.endswith("'"):
                        pk_clean = pk_clean[1:-1].strip()
                        
                    pk_clean = pk_clean.replace("\\\\n", "\n")
                    pk_clean = pk_clean.replace("\\n", "\n")
                    pk_clean = pk_clean.replace("\r\n", "\n")
                    pk_clean = pk_clean.replace("\r", "\n")
                    
                    if "-----BEGIN PRIVATE KEY-----" not in pk_clean:
                        print("[DB WARNING] -----BEGIN PRIVATE KEY----- marker not found in key!")
                    if "-----END PRIVATE KEY-----" not in pk_clean:
                        print("[DB WARNING] -----END PRIVATE KEY----- marker not found in key!")
                        
                    print(f"[DB DIAGNOSTICS] Cleaned private_key length: {len(pk_clean)}")
                    print(f"[DB DIAGNOSTICS] Cleaned private_key newlines: {pk_clean.count(chr(10))}")
                    cred_dict["private_key"] = pk_clean
                    
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
