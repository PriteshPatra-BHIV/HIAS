# COSEC AUDIT
**Owner:** Pritesh
**Scope:** `backend/app/adapters/cosec.py` capability

## Audit Finding
**Status: PARTIAL / HARDCODED**

### Implemented Capabilities
- **Event polling:** WORKING (Parses XML/Text responses via `fetch_events`)
- **Door opening:** WORKING (Triggers HTTP request `open_door`, used in `hardware.py`)

### Missing Capabilities
- **User management:** ABSENT
- **Face enrollment:** ABSENT
- **Face credential upload:** ABSENT
- **Face credential retrieval:** ABSENT
- **User synchronization:** ABSENT
- **Device configuration:** ABSENT

### Assessment
HIAS can pull events and trigger relays remotely using the COSEC HTTP interface. However, it completely lacks the administration components required for the 2,500+ capacity target. Synchronization and credential deployment do not exist in the adapter. It assumes the COSEC device manages its own identities independently.
