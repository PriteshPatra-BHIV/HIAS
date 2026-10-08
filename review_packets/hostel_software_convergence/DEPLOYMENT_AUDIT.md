# DEPLOYMENT AUDIT
Owner: Shivam Pal

## 1. Executive Summary
The deployment posture of HIAS is currently fragmented and contradictory. The repository contains documentation for deploying the backend to the cloud (Render), but the architecture fundamentally requires the backend to run on an edge device (Raspberry Pi) to directly manipulate local GPIO pins. Furthermore, the repository is completely missing necessary edge deployment files (e.g., systemd, setup scripts), meaning any Raspberry Pi deployment is undocumented and manually assembled.

## 2. Environment Deployment Matrix
| Environment | Backend | Frontend | Database | Hardware | Host | Branch | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Development** | Uvicorn | Vite | SQLite | Mocked | localhost | main | PROVEN_REPOSITORY |
| **Staging** | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | ABSENT |
| **Production (Cloud)** | Uvicorn | Build | PostgreSQL | Network | 0.0.0.0 | main | CLAIMED |
| **Production (Edge)**| UNKNOWN | UNKNOWN | SQLite | GPIO 17 | UNKNOWN | UNKNOWN | UNKNOWN |
| **Boys Hostel** | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | ABSENT |
| **Girls Hostel** | Node.js | Vite | Mocked | Mocked | localhost | UNKNOWN | CLAIMED |

## 3. Boys vs Girls Comparison
The repository provides minimal evidence regarding hostel separation.
- **Separate Identity Systems**: DIFFERENT. rontend/server/index.js contains a mock Node.js prototype detached from Python.
