# RUNTIME FLOW
Joint Responsibility

## 1. Trace Check
**FACE:**
Person -> Enrollment -> (Basic String API) -> Database -> (Push missing) -> Hardware (MOCKED) -> HIAS Polling -> Event

**RFID:**
RFID Card -> Reader -> Device -> COSEC -> HIAS Adapter -> Event string polled -> User Identity Mapping (BROKEN) -> Database

**Manual:**
Dashboard -> Manual Override -> Controller /manual/override -> Decision -> Event stream (WORKING)

## 2. Classification List
- UI Form Submit: EXISTS
- Decision Engine: WORKING
- SSE Stream: WORKING
- SQLite Store: WORKING
- Face Sync pushing: ABSENT
- Face Recognition: MOCKED (relies entirely on external device logs)
- RFID mapping Hex: BROKEN
- Push device configure: ABSENT
- Global Identifiers: PARTIAL
