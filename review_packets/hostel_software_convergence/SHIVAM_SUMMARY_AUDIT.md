# HIAS Combined Documentation

This file contains the Architecture reference and the comprehensive audit reports for the HIAS system.



<!-- ============================================== -->
<!-- START OF ARCHITECTURE.md -->
<!-- ============================================== -->

# HIAS System Architecture

This document provides a detailed architectural overview of the HIAS (Hardware Access Controller System), a biometric access control and security command center for the BHIV platform. 

The system interfaces with physical Matrix COSEC door controllers, local Raspberry Pi GPIO relays, and utilizes a deterministic decision engine, monitored and controlled via a React-based security dashboard.

---

## 1. High-Level Architecture Diagram

```text
[Frontend: React / Linear.app UI] 
            │
            ▼ (HTTP REST APIs / SSE Event Streams)
            │
[Backend: FastAPI Core Service]
            ├── [Decision Engine: Deterministic Rule Evaluator]
            │          ├── Rule 0: Emergency Mode Override
            │          ├── Rule 1: Identity & Registry Check
            │          └── Rule 2: Access Time Window
            │
            ├── [Database: SQLite (Local) / PostgreSQL (Prod)]
            │          ├── Users Table
            │          ├── Events Table (Audit Logs)
            │          └── Settings Table
            │
            └── [Hardware Layer & Adapters]
                       ├── Physical Relay (RPi.GPIO Pin 17)
                       ├── COSEC Remote Adapter
                       └── Mock COSEC Server (for CI/Testing)
```

---

## 2. Frontend (Security Command UI)

The frontend serves as the control and monitoring surface for security personnel, providing real-time visibility into gate activity.

- **Technology Stack**: React 19, Vite, React Router DOM.
- **Styling & UI/UX**: Designed using a "Linear.app" inspired dark-mode aesthetic with micro-animations via `framer-motion` and icons from `lucide-react`.
- **Communication**: 
  - **REST APIs**: For fetching historical events, triggering manual overrides, and checking health statuses.
  - **Server-Sent Events (SSE)**: Subscribes to the backend's `/events/stream` endpoint for live, real-time log streaming of access events without polling.

---

## 3. Backend (Execution Brain)

The backend acts as the core execution brain, prioritizing deterministic, offline-first logic to control physical gates and process device inputs.

- **Technology Stack**: Python, FastAPI, Uvicorn.
- **Core Components**:
  - **Main Application (`main.py`)**: Hosts the REST API endpoints and SSE stream generators. Includes robust CORS handling and trailing-slash resolution.
  - **Decision Engine (`engine.py`)**: A purely deterministic rule engine (no probabilistic or AI logic allowed) that evaluates access requests sequentially:
    - **Rule 0 (Emergency Bypass)**: Instantly grants access if `emergency_mode` is triggered.
    - **Rule 1 (User Identity)**: Verifies that the user exists in the local SQLite/PostgreSQL registry.
    - **Rule 2 (Time Window)**: Validates if the current time falls within the configured access hours (e.g., 07:00 - 21:00).
  - **Traceability**: Every access event (RFID/Face) generates a unique `trace_id` for complete auditability.

---

## 4. Database

The system relies on a relational database managed through SQLAlchemy ORM, ensuring data persistence for audits and identities.

- **Environments**: 
  - **Local/Development**: SQLite (`hias.db`).
  - **Production (Render)**: PostgreSQL (via `DATABASE_URL`).
- **Data Models (`models.py`)**:
  - `User`: Stores user identities (`user_id`, `name`, `role`). The system can automatically seed default users on initialization.
  - `Event`: An immutable audit log of all access attempts, capturing `trace_id`, `user_id`, `direction`, `method`, `decision`, and the `reason`.
  - `Setting`: Key-value store for dynamic configurations (e.g., access windows, emergency states).

---

## 5. Integrated Hardware & External Systems

The system is designed to interact with physical world constraints directly.

- **Matrix COSEC Door Controllers**: Integrates with biometric and RFID hardware devices via a dedicated adapter (`adapters/cosec.py`).
- **Local Relays (Raspberry Pi)**: Uses `RPi.GPIO` (specifically targeting Pin 17) to physically trigger door locks/gates upon receiving an `ALLOW` decision.
- **Mock / Simulation Environment**: Includes a mock COSEC server (`mock_cosec.py`) and simulation scripts (`simulate.py`). This allows developers and CI pipelines to test the entire stack, including hardware integrations, without physical devices being present.


<!-- ============================================== -->
<!-- END OF ARCHITECTURE.md -->
<!-- ============================================== -->



<!-- ============================================== -->
<!-- START OF HIAS_INITIAL_DISCOVERY.md -->
<!-- ============================================== -->

# HIAS Initial Discovery Report

## 1. Repository Identity
- **Repository Name**: HIAS
- **Ownership Area**: Runtime, Infrastructure, Deployment, Networking, Environment
- **Report Date**: 2026-09-26

## 2. Git State
- **Current Directory**: `c:\Users\black\OneDrive\Desktop\HIAS\HIAS`
- **Remote URLs**: `origin https://github.com/BHIV-Engineering-Exchange/HIAS.git (fetch & push)`
- **Current Branch**: `main`
- **Latest Commit Hash**: `7f5047253bc44c69864b7475a46e69a59ff89c56`
- **Latest Commit Message**: "docs: add canonical HIAS exit handover"
- **Uncommitted/Untracked Changes**: `ARCHITECTURE.md` is currently untracked.

## 3. Repository Structure
- `backend/`: Python FastAPI backend codebase.
- `frontend/`: React/Vite frontend codebase.
- `logs_data/`: Local storage directory for event and relay audit trails.
- `docs/`: (Created for audit reporting)
- `review_packets/`: Phase review documents (inside `backend/`).
- Root markdown guides (`ARCHITECTURE.md`, `HANDOVER.md`, `README.md`, `RENDER_DEPLOY_GUIDE.md`).

## 4. Technology Stack
- **Python Version Requirements**: 3.10+ (Claimed in Render guide). Current environment runs 3.14.3.
- **Node.js Version Requirements**: Current environment runs v24.14.0.
- **Frontend Framework**: React using Vite (`frontend/package.json`).
- **Backend Framework**: FastAPI with Uvicorn (`backend/requirements.txt`).
- **Database Technology**: SQLite by default, with PostgreSQL supported (psycopg2-binary).
- **ORM/Database Library**: SQLAlchemy (`backend/requirements.txt`).
- **Event/Streaming**: Server-Sent Events (SSE) via `sse-starlette` (`backend/app/main.py`).
- **Hardware Abstraction**: `RPi.GPIO` Python library.
- **Process/Service Manager**: UNKNOWN. No Docker or systemd configurations detected.

## 5. Runtime Components
- **API Server**: Uvicorn.
- **COSEC Worker**: Background task initiated on backend startup (`app/background.py` referenced in `app/main.py`).
- **Simulations**: Python script `backend/scripts/simulate.py`.

## 6. Configuration Sources
- **`backend/.env.example`**: Contains keys for `COSEC_BASE_URL`, `COSEC_USERNAME`, `COSEC_PASSWORD`, `COSEC_POLL_INTERVAL`, `DATABASE_URL`, `PORT`. (SECRET PRESENT = YES).
- **`frontend/.env.example`**: Contains `VITE_API_URL`.
- **Database State**: The `Setting` table overrides system settings upon startup.
- **Hardcoded defaults**: Found in `backend/app/main.py` (`SYSTEM_SETTINGS`).

## 7. Services
- **Backend Service**:
  - Service Name: HIAS Backend
  - Startup Command: `uvicorn app.main:app --reload` (Dev) / `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (Prod)
  - Port: Default `8000`
- **Frontend Service**:
  - Service Name: HIAS Frontend
  - Startup Command: `npm run dev` (Dev) / `npm run build` (Prod)

## 8. Networking
- **Backend Bindings**: Configurable, usually `localhost` or `0.0.0.0`.
- **Frontend API Config**: Pointed via `VITE_API_URL` (default `http://localhost:8000`).
- **CORS Configuration**: Allows ALL origins `["*"]` (`backend/app/main.py`).
- **COSEC Network**: `COSEC_BASE_URL=http://192.168.1.100` (default in env example).
- **SSE Stream**: `/events/stream` for real-time dashboard events.

## 9. Raspberry Pi / Linux Deployment Information
- **Expected OS**: Linux (Raspberry Pi OS).
- **Architecture**: ARM.
- **Hardware Dependencies**: Local Relays rely on `RPi.GPIO` library targeting BCM Pin 17.
- **Runtime System Check**: The local running environment is Windows (`c:\Users\black\...`), NOT a Raspberry Pi. No hardware metrics (uname, memory, disk usage) collected to avoid Windows-specific noise for Linux metrics.

## 10. Database-Related Deployment Information
- Configuration relies on the `DATABASE_URL` env var.
- Defaults to local `sqlite:///./hias.db`.
- Render deployment documentation instructs the creation of a Render PostgreSQL database.

## 11. Hardware-Related Deployment Information
- Backend attempts to connect to physical Matrix COSEC door controllers over the network.
- `ARCHITECTURE.md` states it uses `RPi.GPIO` to trigger physical gate locks/relays upon an `ALLOW` decision.

## 12. Unknowns
- **Process Management**: It's completely unknown how the Pi keeps the backend running across reboots. No `systemd`, `supervisor`, `cron`, or `.sh` startup scripts exist.
- **Cloud vs Edge Architecture Conflict**: The documentation contains a clash. `RENDER_DEPLOY_GUIDE.md` details deploying the backend to Render (Cloud), while `ARCHITECTURE.md` describes the backend triggering local Pi GPIO pins (Edge). A cloud-deployed backend cannot natively toggle local Pi GPIO pins.
- **Production Secrets**: True `.env` configuration file absent from Git.

## 13. Evidence References
- `backend/requirements.txt`: Python package requirements.
- `frontend/package.json`: Node dependencies.
- `backend/app/main.py`: CORS setup, startup scripts, event broadcasting.
- `ARCHITECTURE.md`: Mentions Raspberry Pi GPIO BCM Pin 17.
- `RENDER_DEPLOY_GUIDE.md`: Cloud deployment instructions.
- `backend/.env.example`: Backend configuration keys.


<!-- ============================================== -->
<!-- END OF HIAS_INITIAL_DISCOVERY.md -->
<!-- ============================================== -->



<!-- ============================================== -->
<!-- START OF HIAS_RUNTIME_MAP.md -->
<!-- ============================================== -->

# HIAS Runtime Map

## 1. Runtime Overview
HIAS operates as a dual-component system: a Python-based FastAPI backend acting as the core controller, and a React/Vite frontend acting as the security dashboard. The backend incorporates both synchronous REST endpoints and asynchronous background tasks (COSEC polling, SSE broadcasting, GPIO toggling). 

## 2. Backend Startup
- **Entrypoint**: `backend/app/main.py`.
- **Application Object**: `app = FastAPI(...)`.
- **Invocation**: 
  - Development: `uvicorn app.main:app --reload`
  - Production: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Uses `COSEC_BASE_URL`, `COSEC_USERNAME`, `COSEC_PASSWORD`, `COSEC_POLL_INTERVAL`, `DATABASE_URL`, `PORT`.
- **Database Initialization**: `Base.metadata.create_all(bind=engine)` is called synchronously at module load time (`app/main.py:23`). 
- **Seed Behavior**: `@app.on_event("startup")` executes `seed_db(db)` every time the server starts.
- **Hardware Initialization**: Happens globally on import in `app/hardware.py`. Tries to import `RPi.GPIO`, sets `GPIO_ENABLED` flag accordingly.
- **COSEC Initialization**: `CosecWorker` is instantiated and started as a background `asyncio.Task` inside `@app.on_event("startup")`.
- **Shutdown**: `@app.on_event("shutdown")` gracefully cancels the `CosecWorker` task.

## 3. Frontend Startup
- **Development Command**: `npm run dev` (Executes Vite dev server).
- **Production Build Command**: `npm run build` (Executes Vite build to `dist/`).
- **Production Serving**: Served as a static site (e.g., via Render static sites).
- **Backend API URL**: Relies on `import.meta.env.VITE_API_URL` falling back to `http://localhost:8000` (`frontend/src/api/config.js`).
- **SSE URL**: Instantiated via `new EventSource(API_ENDPOINTS.STREAM)`.
- **Proxy Configuration**: No devServer proxy explicitly configured in `vite.config.js`.

## 4. Process Management
- **systemd / .service**: ABSENT.
- **supervisor / pm2**: ABSENT.
- **Docker / compose**: ABSENT.
- **Startup scripts (`.sh`, `rc.local`)**: ABSENT.
- **Finding**: While Cloud (Render) handles process management natively, it remains completely **UNKNOWN** how the backend and frontend are kept alive, restarted, or initiated on boot on a physical Raspberry Pi. There is zero repository evidence of process management.

## 5. Network Topology
| Component | Host | Port | Protocol | Purpose | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Backend API | 0.0.0.0 | 8000 | HTTP | Core Logic | `RENDER_DEPLOY_GUIDE.md` | PROVEN |
| Frontend | localhost | Vite default | HTTP | UI | `package.json` | PROVEN |
| SSE | Backend | 8000 | HTTP (SSE) | Real-time events | `app/main.py` | PROVEN |
| COSEC API | 192.168.1.100 | 80 | HTTP | Gate controllers | `backend/.env.example` | CLAIMED |
| Database | localhost | Local | SQLite / PG | Storage | `app/database.py` | PROVEN |

**Expected Data Flow**:
Browser -> Frontend -> FastAPI -> Decision Engine -> Database / Hardware -> Event Store -> SSE -> Frontend

## 6. Database Runtime Path
- **Configuration**: Uses `DATABASE_URL` or defaults to `sqlite:///./hias.db`.
- **Initialization**: `create_engine` checks for SQLite vs PostgreSQL format.
- **Migrations**: ABSENT. Relies on SQLAlchemy `create_all()`.
- **Persistence Path Flaw**: The SQLite database path is relative (`./hias.db`). If `uvicorn` is started from the repository root instead of the `backend/` folder, a separate disconnected database is silently created.

## 7. Hardware Runtime Path
- **Initialization**: `app/hardware.py` executes `GPIO.setmode(GPIO.BCM)` and `GPIO.setup(17, GPIO.OUT)`.
- **Resilience**: Wrapped in a `try/except` block. If `RPi.GPIO` is missing, `GPIO_ENABLED = False`.
- **Development Fallback**: Falls back to `[SIMULATION] Relay ON` stdout printing.
- **Risk**: A production environment missing the `RPi.GPIO` library will silently start without hardware capabilities and act as if successful. (PROVEN).

## 8. COSEC Runtime Path
- **Polling Loop**: `CosecWorker._loop_once()` fetches events using `COSECAdapter.fetch_events(last_index)`.
- **Authentication**: Basic Auth passed via HTTPX to `/device.cgi/events`.
- **Trigger**: `COSECAdapter.open_door()` hits `/device.cgi/commands?action=set&cmd=open-door`.
- **Error Handling**: Basic `try/except` catching exceptions and printing to stdout. No exponential backoff.
- **Real vs Mock**: The code attempts real HTTP calls to the IP provided. A `simulate.py` script exists to pump mock HTTP requests to the *FastAPI backend*, but the COSEC adapter itself expects a real device.

## 9. Event and SSE Runtime Path
- **Event Source**: Can originate from `/access/event` HTTP POST or from the `CosecWorker` background poller.
- **Broadcast**: Evaluated events are pushed to an in-memory `asyncio.Queue` per connected client.
- **Disconnect Behavior**: If a frontend disconnects, it loses all events during the offline period. SSE streams only push *new* events from the moment of connection. There is no historical replay for SSE connections.

## 10. Render/Cloud vs Raspberry Pi Findings
- **Cloud Evidence**: `RENDER_DEPLOY_GUIDE.md` details deploying to Render Web Services (Cloud).
- **Edge Evidence**: `ARCHITECTURE.md` explicitly calls for controlling local GPIO Pin 17.
- **Conclusion**: There is a fundamental conflict. A backend deployed on Render cannot manipulate a local Raspberry Pi's GPIO pins. If deployed to the Cloud, the backend will silently enter simulation mode for the relay while potentially still communicating with network-reachable COSEC devices.

## 11. Raspberry Pi Runtime Evidence Required
Because the current workspace is Windows, Raspberry Pi runtime specifics are **UNKNOWN**. 
The following commands should be executed on the physical Raspberry Pi to prove the runtime:

```bash
uname -a
cat /etc/os-release
python3 --version
node --version
systemctl list-unit-files | grep -i hias
journalctl -u hias-backend -n 50
ps aux | grep -i uvicorn
ps aux | grep -i npm
ss -lntup | grep 8000
```


<!-- ============================================== -->
<!-- END OF HIAS_RUNTIME_MAP.md -->
<!-- ============================================== -->



<!-- ============================================== -->
<!-- START OF HIAS_DEPLOYMENT_STATUS.md -->
<!-- ============================================== -->

# HIAS Deployment Status

## 1. Executive Summary
The deployment posture of HIAS is currently fragmented and contradictory. The repository contains documentation for deploying the backend to the cloud (Render), but the architecture fundamentally requires the backend to run on an edge device (Raspberry Pi) to directly manipulate local GPIO pins. Furthermore, the repository is completely missing necessary edge deployment files (e.g., `systemd`, setup scripts), meaning any Raspberry Pi deployment is undocumented and manually assembled.

## 2. Deployment Document Inventory
| Document | Location | Environment | Purpose | Status |
| --- | --- | --- | --- | --- |
| `RENDER_DEPLOY_GUIDE.md` | Root | Cloud (Render) | Instructions for Free Tier Postgres, Backend Web Service, and Frontend Static Site. | CLAIMED |
| `HANDOVER.md` | Root | Development | Quickstart commands and verification endpoints. | PROVEN_REPOSITORY |
| `ARCHITECTURE.md` | Root | Edge (Raspberry Pi) | Defines expected hardware behavior (GPIO Relay BCM 17). | CLAIMED |
| `README.md` | Root | Development | Basic setup instructions and API docs. | PROVEN_REPOSITORY |

## 3. Environment Deployment Matrix
| Environment | Backend | Frontend | Database | Hardware | Host | Port | Branch | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Development** | Uvicorn | Vite | SQLite | Mocked/Simulation | localhost | 8000/8001 | main | PROVEN_REPOSITORY |
| **Staging** | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | ABSENT |
| **Production (Cloud)** | Uvicorn | Static Build | PostgreSQL | Network COSEC only | 0.0.0.0 | $PORT | main | CLAIMED |
| **Production (Edge)**| UNKNOWN | UNKNOWN | SQLite | GPIO Pin 17 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **Boys Hostel** | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | ABSENT |
| **Girls Hostel** | Node.js Express | Vite | Mocked | Mocked/Simulation | localhost | 3000 | UNKNOWN | CLAIMED |

*(Note: `frontend/server/index.js` contains a separate Node.js backend seemingly built as a prototype for the Girls Hostel, contradicting the main Python FastAPI backend).*

## 4. Boys vs Girls Comparison
The repository provides minimal evidence regarding hostel separation.
- **Same Build**: UNKNOWN (No explicit deployment pipelines exist for Boys vs Girls).
- **Same Database**: UNKNOWN.
- **Separate Identity Systems**: DIFFERENT. `frontend/server/index.js` line 53 has a hardcoded decision engine rule: `// Mock rule: IDs starting with 'G' are allowed (Girls Hostel)`. This Node.js prototype is completely detached from the Python `engine.py`, suggesting either an abandoned prototype or a completely bifurcated identity implementation.

## 5. Production Configuration
- `DATABASE_URL`: Essential for switching between SQLite and PostgreSQL. Documented in `RENDER_DEPLOY_GUIDE.md` and `.env.example`. Uncommitted (manually configured).
- `PORT`: Read from environment during production `uvicorn` invocation.
- `VITE_API_URL`: Points frontend to backend. Mentioned in `.env.example`.
- `COSEC_BASE_URL` / `COSEC_USERNAME` / `COSEC_PASSWORD`: Required for Matrix device interaction. Documented in `.env.example`. Uncommitted.
- **Status**: Production configuration is EXTERNAL and MANUALLY CONFIGURED.

## 6. Git / Version Deployment Trace
- **Environment**: Development
- **Branch**: `main`
- **Known Commits**: `bba6d2a`, `e304b06` (from `HANDOVER.md`).
- **Production Commit**: UNKNOWN. There are no Git tags, release workflows, or deployment timestamps to prove what commit is currently running in production.

## 7. Raspberry Pi Deployment Audit
- **Apt/Package Installation**: ABSENT.
- **Python venv setup scripts**: ABSENT (except for manual local instructions in `HANDOVER.md`).
- **systemd / service files**: ABSENT.
- **GPIO setup permissions**: ABSENT (Requires specific user groups/sudo, not documented).
- **Network / Static IP config**: ABSENT.
- **Status**: ABSENT. The repository contains NO reproducible Raspberry Pi deployment procedure.

## 8. Raspberry Pi Runtime Verification Commands
Because the current environment is Windows, the physical Raspberry Pi must be audited using safe read-only commands:
```bash
uname -a
cat /etc/os-release
whoami
pwd
df -h
free -h
ip addr
ss -lntup
ps aux | grep -i uvicorn
ps aux | grep -i node
systemctl list-units --all | grep -i hias
systemctl --type=service --state=running
find /etc/systemd -type f | grep -i hias
journalctl --no-pager -n 100 -u <identified-hias-service>
```

## 9. SQLite Deployment Risk
- **Risk Path**: `sqlite:///./hias.db`
- **Implication**: The `./` syntax resolves relative to the current working directory from which the application is launched. 
- If a systemd service launches the app from `/opt/HIAS`, the database is `/opt/HIAS/hias.db`. 
- If a developer tests by running `cd backend && uvicorn ...`, the database is `/opt/HIAS/backend/hias.db`.
- **Verdict**: HIGH RISK of fragmented, accidental database creation leading to isolated islands of identity data.

## 10. Cloud vs Edge Deployment Model
- **Evidence for Cloud**: `RENDER_DEPLOY_GUIDE.md` provides explicit step-by-step instructions for Render (Cloud).
- **Evidence for Edge**: `ARCHITECTURE.md` dictates local GPIO Pin 17 control via `RPi.GPIO` library.
- **Current Proven Deployment Model**: UNKNOWN. They are mutually exclusive. A cloud-deployed backend cannot physically flip a local Pi's GPIO pin without a local edge proxy (which does not exist in the codebase).
- **Deployment Model Still Requiring Verification**: Must verify if the Pi is running the full backend or merely a browser dashboard pointing to the Cloud.

## 11. Production Readiness
- **Automatic Startup**: NO (Missing systemd/Docker).
- **Crash Recovery**: NO (Missing process manager).
- **Persistent Database**: YES/PARTIAL (Local SQLite is risky; Cloud PG is fine).
- **Persistent Logs**: PARTIAL (Written to `logs/access.jsonl` in the Node prototype, but no rotation).
- **Health Checks**: YES (FastAPI `/health` endpoint).
- **Secret Management**: NO (Relies entirely on external platform variables, no `.env` validation).
- **Deployment Rollback**: NO (No automated pipeline).

## 12. Deployment Unknowns
- How is the physical Raspberry Pi currently staying online?
- Is the Girls Hostel actually running the abandoned Node.js Express prototype (`frontend/server/index.js`), or is it using the Python FastAPI backend?

## 13. Deployment Risks
- **Split Codebase**: Having a Python backend and an embedded Node.js backend prototype in the same repo creates severe deployment confusion.
- **Silent Hardware Failure**: If deployed to Render, the backend will silently enter simulation mode for the relay while successfully connecting to the database.

## 14. Evidence Index
- `RENDER_DEPLOY_GUIDE.md`: Cloud config instructions.
- `ARCHITECTURE.md`: Edge GPIO requirements.
- `backend/app/database.py`: SQLite relative path initialization.
- `frontend/server/index.js`: Line 53 ("Girls Hostel" logic).
- `backend/.env.example`: Secrets and config surface.


<!-- ============================================== -->
<!-- END OF HIAS_DEPLOYMENT_STATUS.md -->
<!-- ============================================== -->



<!-- ============================================== -->
<!-- START OF HIAS_EXECUTION_PATH_AUDIT.md -->
<!-- ============================================== -->

# HIAS Execution Path Audit

## 1. Executive Summary
The repository contains two completely distinct backend implementations: a Python FastAPI backend and a Node.js Express server. Tracing the execution paths proves that the Python backend is the **ACTIVE** authoritative controller integrated with the frontend, database, and hardware. The Node.js server located in `frontend/server/index.js` is an **ORPHANED PROTOTYPE** that uses purely mocked logic, in-memory storage, and `console.log` for hardware interaction. The claim that the "Girls Hostel" uses this Node.js backend is unsupported by deployment configurations.

## 2. Python Backend Execution Path
- **Entry Point**: `backend/app/main.py` via `uvicorn`.
- **Purpose**: Core application logic.
- **Runtime Role**: **ACTIVE**.
- **Execution Flow**:
  1. Receives HTTP POST `/access/event` or polls via `CosecWorker`.
  2. Evaluates via `backend/app/engine.py` (checks User DB, Time Windows).
  3. Triggers hardware via `app/hardware.py` (`RPi.GPIO` Pin 17) or remote COSEC adapter.
  4. Saves to SQLite/PostgreSQL `Event` table.
  5. Broadcasts via SSE `/events/stream`.

## 3. Node Backend Execution Path
- **Entry Point**: `frontend/server/index.js` (Port 3000).
- **Purpose**: Early prototype of the controller.
- **Runtime Role**: **ORPHANED / PROTOTYPE**.
- **Execution Flow**:
  1. Express server handles POST `/access/event`.
  2. Evaluates via hardcoded mock logic (checks if ID starts with 'G').
  3. Appends event to `logs/access.jsonl`.
  4. Stores event in an ephemeral in-memory array `const events = []`.
  5. Uses `console.log('[HARDWARE]')` instead of actual hardware interaction.
- **Reachability**: The server is NEVER started by any repository script (e.g., `package.json` contains no start script for it). It is disconnected from the frontend API.

## 4. Frontend API Ownership
| Frontend Function | Endpoint | Backend Target | Python or Node | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| `API_BASE_URL` | `import.meta.env.VITE_API_URL` or `http://localhost:8000` | FastAPI | Python | `frontend/src/api/config.js` | PROVEN_REPOSITORY |
| `fetchEvents` | `/events?limit=50` | FastAPI | Python | `EventContext.jsx` | PROVEN_REPOSITORY |
| `EventSource` | `/events/stream` | FastAPI | Python | `EventContext.jsx` | PROVEN_REPOSITORY |

The React frontend explicitly targets port 8000 (Python).

## 5. Decision Engine Comparison
| Capability | Python Backend (`engine.py`) | Node Backend (`index.js`) | Same Logic? | Evidence |
| --- | --- | --- | --- | --- |
| Emergency Override | Returns `ALLOW` if `emergency_mode` | Returns `ALLOW` if `emergencyMode` | YES | `engine.py` vs `index.js` |
| User DB Check | Queries SQLAlchemy `User` table | Hardcoded string match | NO | `engine.py` |
| Access Windows | Enforces 07:00 - 21:00 window | None | NO | `engine.py` |
| Hostel Logic | Agnostic | Hardcoded 'G' check | NO | `index.js` line 53 |

The business logic is completely duplicated and divergent.

## 6. Database and Storage Ownership
| Backend | Storage | Read Paths | Write Paths | Persistent? | Status |
| --- | --- | --- | --- | --- | --- |
| **Python** | SQLite / Postgres | SQLAlchemy Queries | `db.add()`, `db.commit()` | YES | ACTIVE |
| **Node** | `events[]` Array / JSONL | Array return | `.unshift()`, `fs.appendFile` | NO (Memory loss on restart) | ORPHANED |

## 7. Hardware Ownership
| Hardware | Python | Node | Simulation | Real Access | Evidence |
| --- | --- | --- | --- | --- | --- |
| **RPi.GPIO** | `app/hardware.py` | None | Fallback | YES | `backend/app/hardware.py` |
| **COSEC** | `adapters/cosec.py` | None | API Mock | YES | `backend/app/adapters/cosec.py` |
| **Console log** | None | `index.js` | Full Mock | NO | `frontend/server/index.js` |

The Node server possesses zero ability to control physical doors or read COSEC devices.

## 8. Event and Audit Ownership
Both backends generate `trace_id` UUIDs. However, the Python backend structures schemas strictly via Pydantic (`schemas.py`) and commits to a relational database. The Node backend uses inline JavaScript objects and calculates a SHA-256 hash chain for observability. They cannot be merged onto the same dashboard because the frontend is hardcoded to listen only to the Python SSE stream on port 8000.

## 9. Girls Hostel Claim Verification
**Claim**: "Girls Hostel uses Node.js Express backend."
- **Classification**: **UNSUPPORTED / CONTRADICTED**
- **Evidence**: The only proof is a code comment (`// Mock rule: IDs starting with 'G' are allowed (Girls Hostel)`) inside the orphaned Node.js script. Because the React frontend always points to the Python backend on port 8000, and because the Node script lacks actual hardware bindings, it is impossible for the Girls Hostel to be running this code in physical production. It was merely a software prototype.

## 10. Execution Graph

**PATH A: Main System (ACTIVE)**
```text
Browser 
 ↓ (React UI)
API config (port 8000)
 ↓ (HTTP)
FastAPI (Python)
 ↓
Decision Engine (engine.py)
 ↓
SQLite/PostgreSQL DB
 ↓
COSEC API / RPi.GPIO (Pin 17)
 ↓
Event Store (Relational)
 ↓
SSE (/events/stream)
 ↓
Dashboard
```

**PATH B: Legacy Prototype (ORPHANED)**
```text
Manual Execution (`node index.js`)
 ↓
Express Server (port 3000)
 ↓
Mock Rule Evaluation
 ↓
Memory Array / JSONL Log
 ↓
Console Log output
```

## 11. Legacy / Prototype / Orphaned Components
- `frontend/server/index.js`: **PROTOTYPE/ORPHANED**. Outdated mock server.
- `frontend/server/simulate.js`: **TEST-ONLY**. Associated with the orphaned server.
- `frontend/server/test_emergency.js`: **TEST-ONLY**.
- `backend/scripts/simulate.py`: **TEST-ONLY**. Used to simulate hardware events against the active Python backend.

## 12. Duplicate Logic Risks
If `frontend/server/index.js` is ever accidentally booted and placed behind a reverse proxy mapping port 8000 to 3000, the system would silently regress into a mock state. Hardware doors would not open, time windows would be ignored, and access records would be lost on reboot.

## 13. Runtime Ambiguities
- The documentation `backend/review_packets/phase2_controller.md` claims the Python server should be booted on port 3000 (`uvicorn ... --port 3000`). This port clashes with the Node server. The default config has since moved to 8000.

## 14. Evidence Index
- `frontend/src/api/config.js` (API endpoints).
- `frontend/package.json` (Missing Node start scripts).
- `frontend/server/index.js` (Node logic and mock hardware strings).
- `backend/app/main.py` (Python logic).


<!-- ============================================== -->
<!-- END OF HIAS_EXECUTION_PATH_AUDIT.md -->
<!-- ============================================== -->



<!-- ============================================== -->
<!-- START OF HIAS_RASPBERRY_PI_RUNTIME_AUDIT.md -->
<!-- ============================================== -->

# HIAS Raspberry Pi Runtime Audit

**ACTUAL RASPBERRY PI ACCESS NOT AVAILABLE FROM THIS ENVIRONMENT.**

The current coding-agent environment is Windows (`C:\Users\black\...`). Direct access to the physical Raspberry Pi is unavailable. Therefore, all runtime facts regarding the Raspberry Pi are explicitly marked as **UNKNOWN**. 

To verify the production runtime, a human operator must execute the exact safe commands listed below on the physical Raspberry Pi.

## 1. Audit Environment
- **Current Environment**: Windows (Development)
- **Raspberry Pi Access**: UNAVAILABLE
- **Verification Status**: PENDING HUMAN EXECUTION

## 2. Raspberry Pi Identity
- **OS**: UNKNOWN
- **OS Version**: UNKNOWN
- **Kernel**: UNKNOWN
- **Architecture**: UNKNOWN
- **Hostname**: UNKNOWN
- **Current User**: UNKNOWN
- **Uptime**: UNKNOWN
- **Commands to run**:
  ```bash
  uname -a
  cat /etc/os-release
  hostnamectl
  whoami
  pwd
  uptime
  date
  ```

## 3. Hardware
- **Model**: UNKNOWN
- **CPU/RAM/Storage**: UNKNOWN
- **Commands to run**:
  ```bash
  cat /proc/cpuinfo
  free -h
  df -h
  lsblk
  vcgencmd get_throttled
  vcgencmd measure_temp
  ```

## 4. Network
- **Interfaces / IPs**: UNKNOWN
- **Listening Ports**: UNKNOWN
- **Commands to run**:
  ```bash
  ip addr
  ip route
  ss -lntup
  hostname -I
  ```

## 5. Running Processes
- **HIAS Processes**: UNKNOWN
- **Commands to run**:
  ```bash
  ps aux | grep -i hias
  ps aux | grep -i uvicorn
  ps aux | grep -i python
  ps aux | grep -i node
  ps aux | grep -i npm
  ps aux | grep -i vite
  ```

## 6. Listening Ports
- **Ports 8000/3000/5173**: UNKNOWN
- **Commands to run**:
  ```bash
  ss -lntup | grep -E '8000|3000|5173'
  ```

## 7. Systemd
- **Service Name**: UNKNOWN
- **Service Status**: UNKNOWN
- **Commands to run**:
  ```bash
  systemctl --type=service --state=running
  systemctl list-unit-files | grep -Ei 'hias|uvicorn|node|vite|python|cosec'
  systemctl list-units --all | grep -i hias
  find /etc/systemd/system -maxdepth 2 -type f | grep -i hias
  ```

## 8. Boot / Autostart
- **Autostart Mechanism**: UNKNOWN
- **Commands to run**:
  ```bash
  cat /etc/rc.local 2>/dev/null
  ls -la /etc/cron*
  ```

## 9. HIAS Installation
- **Path**: UNKNOWN
- **Git Branch / Commit**: UNKNOWN
- **Commands to run**:
  ```bash
  find /home -maxdepth 4 -type d -iname '*hias*' 2>/dev/null
  find /opt -maxdepth 4 -type d -iname '*hias*' 2>/dev/null
  # Once found, cd to the directory and run:
  # git status --short
  # git branch --show-current
  # git rev-parse HEAD
  # git remote -v
  ```

## 10. Python Environment
- **Version/Virtualenv**: UNKNOWN
- **Commands to run**:
  ```bash
  python3 --version
  which python3
  python3 -m pip --version
  ls -la .venv venv env 2>/dev/null
  ```

## 11. Node Environment
- **Version**: UNKNOWN
- **Commands to run**:
  ```bash
  node --version
  npm --version
  which node
  which npm
  ```

## 12. Database Location
- **Path / Owner**: UNKNOWN
- **Commands to run**:
  ```bash
  # Inside the HIAS installation directory:
  find . -name "*.db" -ls
  ```

## 13. Configuration
- **Variables Loaded**: UNKNOWN
- **Commands to run**:
  *(Ensure secrets are REDACTED if printed)*
  ```bash
  cat backend/.env 2>/dev/null
  cat frontend/.env 2>/dev/null
  ```

## 14. Logging
- **Log Locations / Persistence**: UNKNOWN
- **Commands to run**:
  ```bash
  find . -name "*.log" -ls
  find . -name "*.jsonl" -ls
  journalctl --no-pager -n 100 -u hias-backend  # (Replace with actual service name)
  ```

## 15. GPIO Availability
- **RPi.GPIO Installed**: UNKNOWN
- **Commands to run**:
  ```bash
  python3 -c "import RPi.GPIO; print(RPi.GPIO.VERSION)"
  ```

## 16. COSEC Configuration
- **Reachability**: UNKNOWN
- **Commands to run**:
  ```bash
  # Check if COSEC IP is reachable without triggering doors:
  ping -c 4 <COSEC_IP>
  ```

## 17. Actual Deployment Classification
- **Backend**: UNKNOWN
- **Frontend**: UNKNOWN
- **Database**: UNKNOWN
- **GPIO**: UNKNOWN
- **COSEC**: UNKNOWN
- **Startup**: UNKNOWN
- **Process management**: UNKNOWN

## 18. Repository vs Raspberry Pi Comparison
| Component | Repository Expected | Actual Pi | Match? | Evidence |
|---|---|---|---|---|
| OS | Linux | UNKNOWN | UNKNOWN | PENDING |
| Python | 3.10+ | UNKNOWN | UNKNOWN | PENDING |
| Node | Present | UNKNOWN | UNKNOWN | PENDING |
| Backend | Uvicorn (Port 8000) | UNKNOWN | UNKNOWN | PENDING |
| Frontend | Vite Build | UNKNOWN | UNKNOWN | PENDING |
| Database | SQLite/PostgreSQL | UNKNOWN | UNKNOWN | PENDING |
| GPIO | Pin 17 active | UNKNOWN | UNKNOWN | PENDING |
| COSEC | Network HTTP API | UNKNOWN | UNKNOWN | PENDING |
| Startup | Undocumented | UNKNOWN | UNKNOWN | PENDING |
| Git Branch | main | UNKNOWN | UNKNOWN | PENDING |

## 19. Critical Findings
- **Raspberry Pi Unverified**: The entire physical edge deployment remains theoretical until a human operator runs the required read-only commands on the target device.

## 20. Unknowns
- Everything regarding the true physical edge deployment.

## 21. Evidence / Commands
*(Commands listed in respective sections above for human execution).*


<!-- ============================================== -->
<!-- END OF HIAS_RASPBERRY_PI_RUNTIME_AUDIT.md -->
<!-- ============================================== -->



<!-- ============================================== -->
<!-- START OF HIAS_CANONICAL_ARCHITECTURE.md -->
<!-- ============================================== -->

# HIAS Canonical Architecture

## 1. Purpose
The purpose of this document is to definitively establish the canonical architecture for the HIAS system based solely on repository evidence. The repository currently presents contradictory documentation suggesting both Cloud (Render) and Edge (Raspberry Pi) deployments. Furthermore, a legacy Node.js script masquerades as a secondary backend. Before any safe deployment implementation or fixes can occur, the true authoritative architecture must be defined to remove ambiguity.

## 2. Authoritative Execution Path
Based on integration tests, API configurations, and hardware bindings present in the repository, the proven authoritative execution path is:

`Browser` 
→ `React frontend` 
→ `FastAPI` (Port 8000) 
→ `deterministic decision engine` (`app/engine.py`)
→ `database` (SQLAlchemy/SQLite) 
→ `hardware/COSEC` (`app/hardware.py` / `adapters/cosec.py`) 
→ `event persistence` 
→ `SSE` (`/events/stream`) 
→ `dashboard`

## 3. Backend Ownership
- **Python FastAPI**: The authoritative backend for the system. It contains the true database models, hardware adapters, and the functional deterministic decision engine.
- **Node Express** (`frontend/server/index.js`): A legacy/prototype/orphaned component. It relies on mocked in-memory logic and disconnected port configurations. It is not currently executed by any automated startup path.

## 4. Hardware Boundary
The module `backend/app/hardware.py` explicitly utilizes the `RPi.GPIO` library to manipulate local Raspberry Pi GPIO pins (specifically BCM Pin 17). 
**Architectural Fact**: `RPi.GPIO` provides *local* hardware access. Therefore, any deployment requiring physical GPIO relay control **MUST** execute the Python FastAPI backend directly on the physical Raspberry Pi / Edge device.

## 5. Cloud Deployment Limitation
A cloud-hosted FastAPI process (such as the one documented in `RENDER_DEPLOY_GUIDE.md`) cannot directly manipulate GPIO pins physically attached to a local Raspberry Pi unless an explicit edge communication mechanism or local proxy daemon exists.

- **EDGE PROXY: NOT PRESENT IN REPOSITORY**

Because no edge proxy exists, deploying the current codebase solely to the cloud permanently severs its ability to operate local gate relays.

## 6. Deployment Model Matrix
| Model | FastAPI Location | GPIO | Database | Status | Evidence |
|---|---|---|---|---|---|
| Local Development | Developer machine | Simulation | SQLite | PROVEN | `HANDOVER.md` / `main.py` `--reload` / `hardware.py` fallback |
| Raspberry Pi Edge | Raspberry Pi | RPi.GPIO | SQLite | ARCHITECTURALLY SUPPORTED / ACTUAL STATE UNKNOWN | `ARCHITECTURE.md`, `hardware.py` |
| Render Cloud | Render | Cannot access local GPIO | PostgreSQL | DOCUMENTED/CLAIMED | `RENDER_DEPLOY_GUIDE.md` |
| Edge + Cloud | ? | ? | ? | NOT IMPLEMENTED/UNKNOWN | No edge proxy or MQTT client found |

## 7. Node.js Prototype
- **Location**: `frontend/server/index.js`
- **Port**: 3000
- **Logic**: Hardcoded mock string checks (e.g., IDs starting with 'G').
- **Storage**: Ephemeral in-memory array (`events = []`) and raw file appending (`access.jsonl`).
- **Hardware Behavior**: Simulates triggers using `console.log`.
- **Frontend References**: None. The React frontend explicitly connects to FastAPI on port 8000.
- **Package Scripts**: Not started by any frontend `package.json` scripts.
- **Classification**: ORPHANED / PROTOTYPE.

## 8. Production Truth Table
| Component | Repository Truth | Physical Deployment Truth | Verification Status | Required Human Verification |
|---|---|---|---|---|
| **Backend Framework** | FastAPI (Python) | UNKNOWN | PENDING | Check running processes on Pi |
| **Relay Hardware** | BCM Pin 17 | UNKNOWN | PENDING | Verify GPIO wiring on Pi |
| **Database Engine** | SQLite (Local Edge) | UNKNOWN | PENDING | Locate `hias.db` on Pi |
| **Deployment Mode** | Edge (Raspberry Pi) | UNKNOWN | PENDING | Check if Cloud DB/Proxy is active |
| **Autostart/Recovery**| Absent from repo | UNKNOWN | PENDING | Inspect systemd on Pi |

## 9. Decision
The repository-supported **Canonical Software Architecture** is an Edge-Native FastAPI Backend paired with a React Frontend. 

While a cloud deployment is documented (`RENDER_DEPLOY_GUIDE.md`), this is an incomplete architectural fork because deploying the system to the cloud abandons the GPIO capabilities required by `ARCHITECTURE.md`. Since no edge proxy exists in the codebase to bridge a cloud backend to local hardware, the **Intended Edge Architecture** is the only one capable of fulfilling the system's full feature set.

The **Actual Production Runtime** remains completely UNKNOWN pending direct human verification of the physical Raspberry Pi.


<!-- ============================================== -->
<!-- END OF HIAS_CANONICAL_ARCHITECTURE.md -->
<!-- ============================================== -->



<!-- ============================================== -->
<!-- START OF HIAS_DATABASE_PERSISTENCE_AUDIT.md -->
<!-- ============================================== -->

# HIAS Database & Persistence Audit

## 1. Executive Summary
This audit examines the data persistence layers of the HIAS system. The authoritative backend (Python FastAPI) utilizes SQLAlchemy to support both local SQLite and cloud PostgreSQL deployments. A critical risk was identified regarding the relative path of the SQLite database (`./hias.db`), which changes based on the process's working directory, potentially causing data fragmentation. Additionally, the Node.js prototype backend relies on ephemeral in-memory storage and flat-file logging, further reinforcing its status as a deprecated/orphaned component.

## 2. Database Architecture
- **Engine Support**: SQLite (Default) and PostgreSQL.
- **ORM**: SQLAlchemy.
- **Tables**: `users`, `events`, `settings` (defined in `backend/app/models.py`).
- **Connection Handling**: Managed via a standard SQLAlchemy `sessionmaker` mapped to FastAPI `Depends(get_db)` yielding db sessions per request (`backend/app/database.py`).
- **Initialization**: Tables are eagerly created at import time when `backend/app/main.py` evaluates `Base.metadata.create_all(bind=engine)`.
- **Seed Behavior**: `seed_db(db)` is called in the `@app.on_event("startup")` hook to populate default users if the `users` table is empty (`backend/app/main.py`).

## 3. SQLite Configuration
- **Default DATABASE_URL**: `"sqlite:///./hias.db"` (`backend/app/database.py` line 10).
- **Path Behavior**: The path is **relative** (`./`). It is completely dependent on the current working directory (CWD) of the shell invoking the process.
- **Thread Handling**: SQLite connections are created with `connect_args={"check_same_thread": False}` (`backend/app/database.py` line 14).

## 4. PostgreSQL Configuration
- **Support**: Built-in. The string `postgres://` is correctly mapped to `postgresql://` (`backend/app/database.py` line 18).
- **Documentation**: Specifically documented for cloud deployments in `RENDER_DEPLOY_GUIDE.md`.
- **Pooling**: No explicit connection pooling settings (e.g., `pool_size`, `max_overflow`) are configured for PostgreSQL. It relies entirely on SQLAlchemy defaults.

## 5. Database Initialization
- **Table Creation**: Automatic/Eager. `Base.metadata.create_all` executes silently on application startup without a dedicated migration step.
- **Migrations Mechanism**: ABSENT. There is no `alembic` setup or any structured schema migration tool. Changes to `models.py` will not safely apply to existing databases.

## 6. Database File Inventory
- **Search Query**: `Get-ChildItem -Recurse -Include *.db,*.sqlite,*.sqlite3`
- **Result**: No existing database files were found in the repository on this environment.
- **Data Protection**: Because no database files exist, there is no risk of accidental deletion in the current development environment.

## 7. Event Persistence Flow
- **Event Scope**: Events store `trace_id`, `user_id`, `name`, `direction`, `method`, `decision`, `reason`, `device_id`, and `timestamp` (`backend/app/models.py` line 13).
- **Commit Timing**: Commits happen synchronously within the `process_access_request` function immediately after a decision is made (`backend/app/main.py` line 125).
- **Failed Actions**: Yes, denied requests are fully persisted with their specific rejection `reason`.
- **Trace IDs**: Trace IDs (UUIDs) are generated and persisted as the primary key of the `events` table.
- **Immutability Risk**: Event records are **NOT strictly immutable**. The `/review/action` endpoint explicitly modifies existing database events, rewriting the `decision` and `reason` fields (`backend/app/main.py` line 242).
- **Retention/Rotation**: ABSENT. There is no automated rotation or retention policy for the `events` table. It grows indefinitely.

## 8. Python vs Node Storage Comparison
| Backend | Persistent Store | Event Writing | Authoritative? |
| --- | --- | --- | --- |
| **Python FastAPI** | SQLAlchemy (SQLite/PostgreSQL) | Writes directly to relational DB. | **YES** |
| **Node.js Express** | Memory (`events = []`), `logs/access.jsonl` | File append via `fs`. Ephemeral memory. | **NO** (Orphaned) |
| **Simulation Scripts** | None | Sends HTTP POST to API; doesn't write. | **N/A** |

## 9. Persistence Risks
- **Relative SQLite Path Risk (RISK)**: Because the path is `sqlite:///./hias.db`, running `uvicorn` from `/HIAS` creates one database, and running it from `/HIAS/backend` creates a completely separate, disconnected database. 
- **Startup Table Creation (RISK)**: `create_all` runs blindly. If tables exist with a different schema, it will fail or ignore them, leading to silent schema mismatches.
- **Absence of Migrations (RISK)**: Without Alembic, any future addition of columns to `models.py` will require manual `ALTER TABLE` statements by operators or result in application crashes.
- **Indefinite Growth (RISK)**: Without log rotation, the SQLite file or PostgreSQL database will eventually consume all available disk space, especially if COSEC polling generates high volume.

## 10. Migration Status
- **Mechanism**: NONE FOUND.
- **Classification**: **RISK**.

## 11. Backup/Recovery Evidence
- **Evidence**: NONE FOUND.
- **Classification**: **UNKNOWN** (Depends entirely on external infrastructure like Render's automated backups).

## 12. Production Database Unknowns
- It is unknown whether the physical Raspberry Pi deployment currently uses an absolute path, where its database resides, and how large the SQLite file has grown without retention policies.

## 13. Evidence Index
- `backend/app/database.py`: Shows relative path and Postgres string parsing.
- `backend/app/main.py`: Shows `Base.metadata.create_all`, `seed_db`, event mutation logic.
- `backend/app/models.py`: Defines ORM models.


<!-- ============================================== -->
<!-- END OF HIAS_DATABASE_PERSISTENCE_AUDIT.md -->
<!-- ============================================== -->

