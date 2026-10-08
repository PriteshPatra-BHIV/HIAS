# DATABASE AUDIT
Owner: Kaushalendra Yadav

## Database Engine & Scope
Uses SQLite or PostgreSQL (ackend/app/database.py:9-19). Operates as a single central database (ackend/app/database.py:10).

## Existing Entities 
- **User table**: PARTIAL person mapping, lacking metadata (ackend/app/models.py:6-11).
- **Event table**: WORKING access events (ackend/app/models.py:13-24).
- **Setting table**: Dynamic system settings.

## Missing Entities
Credential, Face, RFID, Gate, Device, Authorization, Enrollment, and Synchronization tables are ABSENT (ackend/app/models.py).

## Analysis
The backend successfully centralizes access events into a single database without strict capacity ceilings, proving it can store data at scale. However, the system completely lacks any credential, biometric, or gate authorization modeling. The current data model cannot represent Face, RFID, Device, Gate, Authorization, or Synchronization.
