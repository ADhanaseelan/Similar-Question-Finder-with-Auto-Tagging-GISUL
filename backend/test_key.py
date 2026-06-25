import json
import os
from firebase_admin import credentials

try:
    key_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
    with open(key_path) as f:
        data = json.load(f)
    pk = data.get("private_key", "")
    print("PRIVATE KEY ANALYSIS:")
    print("Length:", len(pk))
    print("Starts with BEGIN:", pk.startswith("-----BEGIN PRIVATE KEY-----"))
    print("Ends with END:", pk.strip().endswith("-----END PRIVATE KEY-----"))
    print("Count of \\n (escaped):", pk.count("\\n"))
    print("Count of actual newlines:", pk.count("\n"))
    
    # Try to load it
    cred = credentials.Certificate(key_path)
    print("SUCCESS: Loaded key file locally!")
except Exception as e:
    print("FAILURE:", e)
