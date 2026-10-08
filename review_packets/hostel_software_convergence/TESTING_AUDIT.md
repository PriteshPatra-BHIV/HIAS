# TESTING & EVIDENCE AUDIT
**Owner:** Pritesh
**Scope:** Reviewing existing load tests, unit tests, and performance claims

## Audit Finding
**Status: PROVEN FOR SOFTWARE / MOCKED FOR HARDWARE**

### Test Evidence Assessment
- **Integration Tests (`test_integration.py`):** **PROVEN**
- **COSEC Mocking (`mock_cosec.py` / `run_system_test.py`):** **PROVEN**
- **Phase 3 Controller Performance Claims (968 events/sec, 10ms latency):** **CLAIMED (Software Layer Only)**
  - This claim represents the internal `/access/event` REST endpoint processing speed.
  - It does NOT include the COSEC hardware polling interval (`COSEC_POLL_INTERVAL=1.0`), meaning a real-world user will wait at least 1 second for polling.
  - It does NOT account for the physical relay actuation time (`TRIGGER_DURATION=1.5`).

### Conclusion
The existing tests accurately reflect the software's reliability but the performance claims are isolated to the software decision engine and mislead the actual hardware-integrated latency expected at the gate.
