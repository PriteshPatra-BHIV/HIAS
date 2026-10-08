# FACE RECOGNITION AUDIT
Owner: Kaushalendra Yadav

## Recognition Origin
Face recognition is MOCKED in the HIAS backend. Real recognition happens externally on the COSEC device, and the backend simply polls the remote log and maps it to Method.FACE (ackend/app/adapters/cosec.py:64).

## UI Mocking
The ControllerEvent and Event schema (ackend/app/models.py:13-24, ackend/app/schemas.py:47-56) contain absolutely no biometric embeddings or confidence scores. Any UI element (e.g., confidence bars) relying on this data is unverified/mocked.

## Status
MOCKED. The frontend shows fake data, and the backend does no processing or matching. It only relies on logs from the standalone physical devices.
