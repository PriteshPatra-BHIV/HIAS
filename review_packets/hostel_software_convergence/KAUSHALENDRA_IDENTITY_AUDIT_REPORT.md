# HIAS Identity / Database / Enrollment / Capacity Audit — Consolidated Report
Owner: Kaushalendra Yadav
Scope: Identity, Database, Enrollment, Capacity, Synchronization

## 1. Executive Summary
The backend successfully centralizes access events into a single database without strict capacity ceilings, proving it can store data at scale. However, the system completely lacks any credential, biometric, or gate authorization modeling. The single biggest blocker to the five hostel requirements is the total absence of identity synchronization: "enrollment" only saves a string in the database but pushes nothing to the hardware devices. Because hardware and software are disjointed and mapped only via hardcoded dictionaries, "enroll once, works everywhere" is thoroughly broken.

## 2. Database Reality (from DATABASE_AUDIT.md)
- **DB Engine & Scope:** Uses SQLite or PostgreSQL (`backend/app/database.py:9-19`). Operates as a single central database (`backend/app/database.py:10`).
- **Entities that Exist:** 
  - `User` table (PARTIAL person mapping, lacking metadata) (`backend/app/models.py:6-11`).
  - `Event` table (WORKING access events) (`backend/app/models.py:13-24`).
- **Missing Entities:** 
  - Credential, Face, RFID, Gate, Device, Authorization, Enrollment, and Synchronization tables are ABSENT (`backend/app/models.py`).

## 3. Capacity Reality (from CAPACITY_AUDIT.md)
- **Storage Capacity:** There are no hardcoded row limits or ceilings on user count in the database schema (`backend/app/models.py`) or enrollment endpoint (`backend/app/main.py:349-359`). The backend database will easily accept the 2,501st user.
- **Display Limits:** API pagination caps data returns (e.g., 10 items in `GET /events` `backend/app/main.py:142`, 10 items in `GET /users/search` `backend/app/main.py:364`, 20 items in `GET /alerts` `backend/app/main.py:312`). These are purely display limits, NOT data or storage limits.
- **Device-Sync Capacity:** Device synchronization capacity is fundamentally broken. Users are manually mapped via a hardcoded dictionary (`backend/app/background.py:17-21`), meaning the 2,501st user would be completely ignored by the devices.

## 4. Identity Model Reality (from IDENTITY_AUDIT.md)
- **Generation & Duplicates:** The `user_id` is operator-chosen via the API (`backend/app/main.py:350-351`). Backend strictly prevents duplicates by raising a 400 error if the ID already exists (`backend/app/main.py:355-356`).
- **Shared Identity Context:** Identity sharing is MOCKED / BROKEN. While there is one global identity in the `User` table (`backend/app/models.py:6`), mapping device users to backend users relies heavily on a hardcoded dictionary (`backend/app/background.py:17-21`), creating disjointed identities across gates.

## 5. Enrollment Workflow Reality (from ENROLLMENT_AUDIT.md)
- **Workflow Trace:** `POST /users` takes a JSON `user_id` and `name` (`backend/app/main.py:350-352`), checks if they exist (`backend/app/main.py:353-356`), and saves the `User` object (`backend/app/main.py:357-359`).
- **Captured vs. Not Captured:** Enrollment captures only basic strings. It does NOT capture or store credentials or biometrics.
- **Device Push & "Enroll Once":** Device push is ABSENT (`backend/app/main.py:349-359`). The concept of "enroll once, works everywhere" is BROKEN today since no data is sent to the devices.

## 6. Face Recognition Reality (from FACE_RECOGNITION_AUDIT.md)
- **Recognition Origin:** Face recognition is MOCKED in the HIAS backend. Real recognition happens externally on the COSEC device, and the backend simply polls the remote log and maps it to `Method.FACE` (`backend/app/adapters/cosec.py:64`).
- **UI Mocking:** The `ControllerEvent` and `Event` schema (`backend/app/models.py:13-24`, `backend/app/schemas.py:47-56`) contain absolutely no biometric embeddings or confidence scores. Any UI element (e.g., confidence bars) relying on this data is unverified/mocked.

## 7. Multi-Gate Reality (from MULTI_GATE_AUDIT.md)
- **Gate/Device Entity:** ABSENT. `device_id` is merely a string tag in the `Event` schema (`backend/app/models.py`).
- **Authorization Scope:** ABSENT. Identities cannot be scoped to specific gates. The logic only evaluates global time windows and identity existence (`backend/app/engine.py:29-51`).
- **Event Convergence:** WORKING. Events from all `device_id`s successfully converge into a single central `Event` table (`backend/app/main.py:113-124`).

## 8. Cross-File Consistency Check
- **Consistency Verification:** All files were thoroughly cross-checked. 
  - `ENROLLMENT_AUDIT.md` calls idempotency "PARTIAL / BROKEN" due to the 400 error.
  - `IDENTITY_AUDIT.md` calls identity context "MOCKED / BROKEN" due to the hardcoded dictionary.
  - Both statements accurately reflect the disparate contexts (one discussing the HTTP verb behavior, the other discussing system-wide identity mapping). No contradictory phrasing was found across the six files. The phrasing and findings are consistent.

## 9. My Rows for HIAS_GAP_MATRIX.md

| Requirement | Current Implementation | Evidence | Status/Gap | Impact | Required Change |
| --- | --- | --- | --- | --- | --- |
| 2,500+ users | No DB limits, but hardcoded device mapping | `backend/app/models.py`, `backend/app/background.py:17-21` | GAP (Sync) | Devices won't recognize new users | Remove hardcoded `USER_MAPPING`, implement DB-driven sync |
| One-click enrollment | Basic string POST exists, no biometrics or hardware push | `backend/app/main.py:349-359` | GAP | Users must be manually enrolled on devices | Add device push logic to `POST /users` |
| One central DB | Working SQLite/Postgres setup without parallel stores | `backend/app/database.py:9-19`, `backend/app/main.py:113-124` | WORKING | Event history is correctly centralized | None required for basic events |
| Multi-gate identity | No schema for Gate/Authorization. Global identity relies on dictionary | `backend/app/models.py`, `backend/app/engine.py:29-51` | GAP | Cannot restrict access by gate | Create Gate/Authorization tables and update `evaluate()` |
| Face recognition | Backend only logs string tags, UI mocks confidence scores | `backend/app/models.py:13-24`, `backend/app/adapters/cosec.py:64` | GAP | UI shows fake data, backend does no matching | Decide if backend should do matching or just read COSEC |
| Device synchronization | Non-existent; relies entirely on hardcoded `USER_MAPPING` | `backend/app/background.py:17-21`, `backend/app/main.py:349-359` | BROKEN | New system users can't open gates | Build two-way sync engine for credentials |

## 10. Open Items For Shivam / Pritesh
- **COSEC Push-Sync (Shivam/Pritesh):** My audit proves the backend `POST /users` does not push to COSEC. We need to verify if the COSEC API even supports remote credential enrollment via software, or if it must be done on the hardware.
- **RFID Hardware Path (Pritesh):** The backend has zero schema for RFID mapping. We need to know what format the RFID reader sends (Wiegand vs raw string) to design the missing `Credential` table.
