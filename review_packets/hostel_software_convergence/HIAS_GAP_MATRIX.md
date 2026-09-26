# HIAS GAP MATRIX

| Requirement | Current Implementation | Evidence | Status/Gap | Impact | Required Change |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2,500+ users** | No DB limits, but hardcoded device mapping limits system to 3 users. | `models.py`, `background.py:17` | **GAP** (Sync) | Devices won't recognize new users | Remove hardcoded `USER_MAPPING`, implement dynamic DB query |
| **One-click enrollment**| Basic string POST exists in UI/API, no biometrics/RFID or hardware push | `main.py`, `Users.jsx` | **GAP** | Users must be manually enrolled on each physical device | Add `Credential` schema & push logic |
| **One central DB** | Working SQLite/Postgres setup without parallel stores | `database.py`, `main.py` | **WORKING** | Event history is centralized | Add tables for Credentials & Gates |
| **RFID** | Adapter parses events, but no central registry exists to map them | `cosec.py`, `background.py` | **BROKEN** | RFID only works for 3 hardcoded users | Create API to capture/sync RFID cards |
| **Multi-gate identity** | Global identity relies on dictionary; no Gate schema | `models.py`, `engine.py` | **GAP** | Cannot restrict access by gate | Create `Gate` table, update sync engine |
| **Face recognition** | Backend logs string tags; UI mocks confidence scores | `models.py`, `cosec.py` | **MOCKED** | UI shows fake data | Define biometric template flow |
| **Device synchronization**| Non-existent; relies on hardcoded mapping | `background.py:17` | **ABSENT** | New users can't open gates | Build two-way sync engine for COSEC |
| **Enrollment demo** | Lacking software payload to prove sync | N/A | **GAP** | Cannot demonstrate yet | Execute the Software Demo Plan |
| **Offline behaviour** | Gates have local memory, but HIAS cannot update it | N/A | **PARTIAL** | Gates work offline, but only for old users | Fix Device Sync |
| **Central event history**| Event loop and SSE broadcast work perfectly | `main.py` | **WORKING** | Full visibility | None |
