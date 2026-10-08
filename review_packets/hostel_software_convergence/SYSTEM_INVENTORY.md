# SYSTEM INVENTORY
Joint Responsibility

## Structure
- **Repository**: HIAS
- **Backend**: Python FastAPI, SQLAlchemy, Uvicorn
- **Frontend**: React 19, Vite, Tailwind
- **Database**: SQLite (default local) / PostgreSQL (cloud)
- **Hardware**: COSEC (Network Adapter) / RPi.GPIO (Pin 17 Relay loop)
- **Adapters**: COSEC Adapter via HTTP Polling
- **APIs**: REST API /access/event & SSE /events/stream
- **Tests**: Present in /tests but mocked for physical devices
- **Logs**: Written via SQLite Event store and node prototype logs/access.jsonl

## Components
| Component | Location | Purpose | Owner | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| FastAPI Controller | ackend/app/main.py | API & Logic | Pritesh | PROVEN | Starts on Port 8000 |
| Decision Engine | ackend/app/engine.py | Access logic | Pritesh | PROVEN | Tested natively |
| Relational Schema | ackend/app/models.py | DB Setup | Kaushalendra | PROVEN | Missing Entities |
| React UI | rontend/ | Dashboard | Team | PARTIAL | Hardcoded endpoints |
| Hardware Abstraction| ackend/app/hardware.py| Edge GPIO Control | Shivam | CLAIMED | Pin 17 |
