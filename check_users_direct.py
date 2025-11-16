import sys
sys.path.append('clinic_scheduler_backend')

from clinic_scheduler_backend.app.database import get_db
from clinic_scheduler_backend.app.models.user import User
from sqlalchemy.orm import Session

db: Session = next(get_db())
users = db.query(User).all()
print('Users count:', len(users))
for u in users:
    print(f'ID: {u.id}, Name: {u.name}, Email: {u.email}, Role: {u.role}')
db.close()
