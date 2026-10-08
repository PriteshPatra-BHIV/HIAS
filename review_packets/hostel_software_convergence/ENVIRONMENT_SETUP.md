# ENVIRONMENT SETUP
Owner: Shivam Pal

## 1. Development Environment
- Windows OS detected currently instead of Raspberry Pi.
- Relies exclusively on HANDOVER.md for local testing. Python 3.10+, Node v24.14+.
- Database defaults to relative SQLite sqlite:///./hias.db.

## 2. Production Dependencies
- **Cloud vs Edge Deployment Model**: There is no proven automated production environment.
- **Process Management**: Systemd files, PM2, or Docker containers are entirely ABSENT.

## 3. SQLite Deployment Risk
The SQLite database path is relative (./hias.db). Running uvicorn from different directories creates fragmented data islands.
