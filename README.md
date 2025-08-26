# IT-Project_Syntax_Syndicate-
Final year IT project Group 4

1. Purpose of the Project
The purpose of Clock To Go is to provide a secure, efficient, and user-friendly time and attendance register system. Traditional methods such as paper registers and outdated punch clocks are prone to errors, manipulation, and inefficiencies (e.g., time theft, buddy punching, payroll disputes).

Clock To Go aims to solve these problems by integrating biometric/QR authentication, camera verification, and encrypted cloud storage. The system will ensure:
- Accurate employee attendance tracking
- Strong data protection and compliance with laws (e.g., POPIA and GDPR)
- Increased transparency, trust, and confidence among employees and employers
- Scalable integration with HR/payroll systems

Ultimately, the project will set a benchmark for secure, modern digital attendance management.
2. Existing Systems
Existing time and attendance systems have evolved significantly over the years, moving from manual punch cards to modern biometric and cloud-based solutions. Many organizations today use biometric verification (fingerprint or facial recognition), magnetic swipe cards, or mobile apps to record employee attendance. These systems have improved efficiency, reduced manual errors, and provided real-time integration with payroll. However, they also come with challenges, such as data security risks, lack of transparency in how biometric data is stored, and vulnerabilities to cyber threats if encryption and access controls are weak. While existing systems have enhanced workforce management, their limitations highlight the need for a more secure, transparent, and scalable solution such as Clock To Go.
3. Implementation Language
The system will use a multi-language approach based on functionality:

- Frontend (User Interface): React.js – for building a responsive and user-friendly interface.
- Backend (Business Logic): Python (FastAPI) – for server-side processing, authentication logic, and secure APIs.
- Database: MySQL / PostgreSQL – for storing attendance data securely with encryption.
- Security Features: Python cryptography libraries for encryption of stored/transmitted data.
4. SDLC Model Chosen – Waterfall
The Waterfall SDLC model has been chosen for Clock To Go.

Reasons:
- The project requirements are well defined and unlikely to change drastically.
- Waterfall ensures a structured and sequential approach where each phase (Requirements → Design → Implementation → Testing → Deployment → Maintenance) is completed before moving to the next.
- This model provides clear documentation at every stage, which is important for academic evaluation.
- It reduces risks of confusion since the project will follow a step-by-step process with milestones clearly outlined.

The Waterfall model will help ensure the system is delivered in a controlled and organized manner.
5. Data Model
For Clock To Go, the Relational Data Model (using MySQL/PostgreSQL) will be the primary choice. This is because attendance systems deal with structured data such as employees, attendance logs, departments, and payroll integration. Relational databases provide strong ACID compliance, ensuring accurate and reliable record-keeping.

Example tables include:
- Employees (emp_id, name, role, department, biometrics, QR_code)
- Attendance (record_id, emp_id, clock_in, clock_out, status)
- Users (user_id, username, password_hash, role)
- AuditLogs (log_id, user_id, action, timestamp)

This structured model simplifies report generation, supports regulatory compliance, and integrates easily with payroll systems. Optionally, a NoSQL database like MongoDB can be used alongside it for biometric logs or image storage, creating a hybrid model if scalability is required.
