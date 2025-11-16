import urllib.request
import json

data = json.dumps({
    'name': 'Test User',
    'email': 'test@example.com',
    'password': 'password123',
    'role': 'patient'
}).encode('utf-8')

req = urllib.request.Request(
    'http://127.0.0.1:8000/auth/register',
    data=data,
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    print('Status:', response.getcode())
    print('Response:', response.read().decode())
except Exception as e:
    print('Error:', e)
