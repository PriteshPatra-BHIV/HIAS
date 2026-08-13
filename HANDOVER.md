# HIAS_HANDOVER.md — HIAS Facial Recognition & Access Control System Handover

**Subsystem**: HIAS Hardware Access Controller, Matrix COSEC Adapter, Deterministic Decision Engine, Security Command UI  
**Receiving Owners**: Suraj Dhruv + Rajaryan Verma + Karan + Harsha  
**Previous Owner**: Soham Kotkar  
**Primary Repository**: [HIAS](file:///c:/PC/Office%20Projects/HIAS) (`https://github.com/Soham20030/HIAS.git`)  
**Active Branches**: `main` (active), `integration-vijay`  
**Last Verified Date**: 13 August 2026  
**Status**: **WORKING** (Mock hardware & real-time control verified)  

---

## 1. Executive Summary & Architecture

HIAS is the biometric access control and security command center for the BHIV platform. It interfaces with physical Matrix COSEC door controllers, local Raspberry Pi GPIO relays (Pin 17), deterministic rule engines, and a Linear.app-inspired React security dashboard.

```text
[HIAS Frontend: React / Linear.app UI (frontend/src/App.jsx)]
            │
            ▼ (HTTP REST / SSE Event Stream)
[HIAS Backend: backend/app/main.py (FastAPI)]
            ├── [Decision Engine: backend/app/engine.py]
            │          ├── Rule 0: Emergency Mode Override
            │          ├── Rule 1: Identity & Seed User Database
            │          └── Rule 2: Access Window (07:00 - 21:00)
            └── [Hardware Layer: backend/app/hardware.py]
                       ├── Physical Relay (RPi.GPIO Pin 17)
                       └── COSEC Remote Adapter (backend/app/adapters/cosec.py)
```

---

## 2. Key Contributions by Soham Kotkar

| Commit SHA | Commit Message | Key File Changes | Feature / Fix Description |
| :--- | :--- | :--- | :--- |
| `56c9f4c` | `UI Overhaul: Linear.app design system` | `frontend/src/App.jsx`, `frontend/src/index.css` | Complete redesign of security command surface with Linear dark mode. |
| `8bed23d` | `add mock COSEC server and automated hardware-less integration test suite` | `backend/app/mock_cosec.py`, `backend/tests/` | Built mock COSEC server emulating hardware biometric devices for CI. |
| `bba6d2a` | `feat: finalize real-time control integration and UI hardening` | `backend/app/main.py`, `backend/app/engine.py` | Hardened real-time relay control, SSE event streams, and production APIs. |
| `e6355ae` | `fix: SystemStatus UI mapping and restore SSE headers` | `backend/app/main.py` | Restored Server-Sent Events (SSE) headers for live log streaming. |
| `e304b06` | `fix: make API_BASE_URL robust against trailing slashes and relax CORS` | `backend/app/main.py` | Robust URL parsing and relaxed CORS for local & staging environments. |
| `cf4c96e` | `fix: bypass duplicate check for manual override and add frontend safety` | `backend/app/main.py` | Allowed security guard manual override bypass without triggering duplicate log blocks. |

---

## 3. Core Execution & Setup Commands

### Backend Startup (Local / Mock Mode)
```bash
cd "c:\PC\Office Projects\HIAS\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Mock COSEC Hardware Server Startup
```bash
cd "c:\PC\Office Projects\HIAS\backend"
python app/mock_cosec.py --port 9090
```

### Frontend Command Surface Startup
```bash
cd "c:\PC\Office Projects\HIAS\frontend"
npm install
npm run dev
```

---

## 4. Verification & Testing Evidence

- **Healthcheck Endpoint**: `GET http://localhost:8001/api/v1/health`
- **SSE Log Stream**: `GET http://localhost:8001/api/v1/events`
- **Evaluate Access API**: `POST http://localhost:8001/api/v1/evaluate`

---

## 5. Ownership Transfer Sign-off

- **Previous Owner**: Soham Kotkar
- **Receiving Owners**: Suraj Dhruv + Rajaryan Verma + Karan + Harsha
- **Transfer Status**: **READY** (Mock server, hardware abstraction, UI verified)
