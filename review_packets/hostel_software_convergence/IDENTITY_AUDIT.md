# IDENTITY AUDIT
Owner: Kaushalendra Yadav

## Generation & Duplicates
The user_id is operator-chosen via the API (ackend/app/main.py:350-351). Backend strictly prevents duplicates by raising a 400 error if the ID already exists (ackend/app/main.py:355-356).

## Shared Identity Context
Identity sharing is MOCKED / BROKEN. While there is one global identity in the User table (ackend/app/models.py:6), mapping device users to backend users relies heavily on a hardcoded dictionary (ackend/app/background.py:17-21), creating disjointed identities across gates. The system completely lacks identity synchronization to the physical gates. "Enroll once, works everywhere" is thoroughly broken.
