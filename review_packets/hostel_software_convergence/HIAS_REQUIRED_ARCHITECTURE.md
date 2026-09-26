# HIAS REQUIRED ARCHITECTURE (CONVERGENCE PLAN)

## 1. Objective
Achieve the 5 hostel requirements (2,500+ users, unified enrollment, one DB, working RFID, demo) by converging the existing software assets. We will NOT rebuild the system from scratch. We will reuse the FastAPI Controller, Decision Engine, and React Frontend.

## 2. The Target Architecture
```text
                    CENTRAL HIAS
                         │
                ┌────────┴────────┐
                │                 │
        Identity Registry    Event / Truth Store
        (PostgreSQL/SQLite)  (Working today)
                │                 │
          One-time Enrollment     │
          (API + UI Update)       │
                │                 │
       Credential Distribution    │
         (NEW SyncWorker)         │
                │                 │
        ┌───────┼────────┐        │
        ↓       ↓        ↓        ↓
      Gate 1  Gate 2   Gate 3   Dashboard
        │       │        │
        └───────┴────────┘
                │
          Local cache/sync
```

## 3. Required Changes (Minimum Viable Fixes)

### A. Database Schema Updates
1. Add a `Credential` table (linked to `User`) to store RFID strings and biometric template hashes.
2. Add a `Gate` table to register COSEC devices (Gate 1, Gate 2) so HIAS knows where to sync credentials.

### B. Controller & API Updates
1. Update `POST /users` to accept RFID/Face payload.
2. Implement `GET /devices` to read from the actual `Gate` table instead of hardcoded mocks.
3. Remove the hardcoded `USER_MAPPING` in `background.py`. The background poller must query the DB to map device `userid` to HIAS `user_id`.

### C. Synchronization Engine (NEW)
1. Create a `SyncWorker` task in `background.py`.
2. When a user is enrolled, `SyncWorker` iterates through all registered `Gate` devices and calls `COSECAdapter.push_user()` to push the credential to local device memory.

### D. Frontend Updates
1. Update `Users.jsx` to include an "Assign RFID" input field during enrollment.

### E. Infrastructure/Deployment (Shivam)
1. Remove the legacy Node.js script to avoid confusion.
2. Standardize on the FastAPI deployment using an edge Pi (for GPIO) or establish a clear cloud proxy strategy.
