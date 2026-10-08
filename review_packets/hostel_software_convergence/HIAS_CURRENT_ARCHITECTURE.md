# HIAS CURRENT ARCHITECTURE
Joint Responsibility

## 1. High-Level Architecture Diagram
`	ext
[Frontend: React / Linear.app UI] 
            |
            v (HTTP REST APIs / SSE Event Streams)
            |
[Backend: FastAPI Core Service]
            |-- [Decision Engine: Deterministic Rule Evaluator]
            |          |-- Rule 0: Emergency Mode Override
            |          |-- Rule 1: Identity & Registry Check
            |          |-- Rule 2: Access Time Window
            |
            |-- [Database: SQLite (Local) / PostgreSQL (Prod)]
            |
            |-- [Hardware Layer & Adapters]
                       |-- Physical Relay (RPi.GPIO Pin 17)
                       |-- COSEC Remote Adapter
`

## 2. Evidence Discrepancies
- DOCUMENTATION (Cloud & multi-door sync claimed) -> RUNTIME (Edge/Pin 17 bound, sync missing).
- The system heavily biases towards local execution (SQLite mapping) but has Render (Cloud) docs.
- The User database only tracks strings, with zero physical biometric records held internally.
