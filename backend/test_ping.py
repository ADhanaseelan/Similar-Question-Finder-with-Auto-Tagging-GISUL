import requests

try:
    print("Sending ping to backend...")
    res = requests.get("http://localhost:8000/api/dashboard/stats")
    print("Backend is responding! Status:", res.status_code)
except Exception as e:
    print("Backend is NOT responding:", e)
