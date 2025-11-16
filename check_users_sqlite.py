import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('clinic.db')
cursor = conn.cursor()

# Query the users table
cursor.execute("SELECT id, name, email, role FROM users")
users = cursor.fetchall()

print('Users count:', len(users))
for u in users:
    print(f'ID: {u[0]}, Name: {u[1]}, Email: {u[2]}, Role: {u[3]}')

conn.close()
