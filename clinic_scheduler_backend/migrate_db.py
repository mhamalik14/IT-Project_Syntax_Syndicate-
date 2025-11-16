import sqlite3

def migrate_db():
    # Connect directly to SQLite
    conn = sqlite3.connect('clinic.db')
    cursor = conn.cursor()

    # Check if columns exist and add them if not
    cursor.execute("PRAGMA table_info(users)")
    columns = [row[1] for row in cursor.fetchall()]

    if 'phone' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(20)")
        print("Added phone column")

    if 'date_of_birth' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN date_of_birth DATE")
        print("Added date_of_birth column")

    if 'address' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN address VARCHAR(255)")
        print("Added address column")

    if 'emergency_contact' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN emergency_contact VARCHAR(100)")
        print("Added emergency_contact column")

    conn.commit()
    conn.close()
    print("Migration completed")

if __name__ == "__main__":
    migrate_db()
