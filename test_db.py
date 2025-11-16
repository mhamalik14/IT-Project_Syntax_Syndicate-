from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

db: Session = next(get_db())
users = db.query(User).all()
print('Users count via model:', len(users))
for u in users:
    print(f'ID: {u.id}, Name: {u.name}, Email: {u.email}, Role: {u.role}')
db.close()
