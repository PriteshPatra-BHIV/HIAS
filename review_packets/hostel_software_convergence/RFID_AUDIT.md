# RFID AUDIT
**Owner:** Pritesh
**Scope:** RFID Pathway

## Audit Finding
**Status: BROKEN / MOCKED**

### Current Path
Physical RFID Reader -> Device -> COSEC -> HIAS Adapter (`cosec.py`) -> Identity Mapping -> Decision Engine -> Relay -> Event Store

### Assessment
- `backend/app/adapters/cosec.py` simply polls events. If the method is `rfid`, it creates an event.
- However, there is no central mechanism to enroll an RFID card. The user's RFID badge is manually stored inside the physical gate terminal's memory.
- There is no central identity mapping linking a specific RFID badge Hex/ID to a user identity dynamically. The system relies on a hardcoded map of device IDs (e.g. `12`) to user identities (e.g. `S001`).
- If a new user needs RFID access, they must be manually enrolled on the physical reader and hardcoded in the script.

**Conclusion:** RFID flow fails due to the lack of central credential management. The system relies entirely on the local device's database rather than the central HIAS ecosystem.
