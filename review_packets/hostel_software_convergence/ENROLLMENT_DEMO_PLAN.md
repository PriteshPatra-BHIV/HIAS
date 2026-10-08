# ENROLLMENT DEMONSTRATION PLAN
**Owner:** Pritesh

## Objective
Demonstrate the "Enroll Once -> Sync Everywhere -> Access" workflow using the existing architecture, highlighting the gap bridging process before full hardware remediation is completed.

## Demonstration Workflow (Software Simulated)
1. **Create Student/Staff:** Call `POST /users` to create a canonical user identity.
2. **Capture/Register Credential:** Extend the API (or use mocked physical payload) to register an RFID hex sequence against the central user profile.
3. **Synchronize Authorization:** Implement a mock `SyncWorker` that simulates a dispatch loop, displaying network logs demonstrating the credential being sent to all registered gate terminals.
4. **Authorized Gate / Access Decision:** Run `run_system_test.py` targeting the mock COSEC device which pretends to scan the new user.
5. **Event Recorded Centrally:** Show the UI dashboard receiving the event via SSE (`/events/stream`) in real-time.

**Hardware Dependency:** The physical face/RFID syncing is explicitly flagged as pending hardware. The demonstration proves the central HIAS controller's capability to orchestrate identity without relying on isolated gate memory.
