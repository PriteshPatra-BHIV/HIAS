# HIAS RUNTIME MAP
Owner: Shivam Pal

## 1. Runtime Overview
HIAS operates as a dual-component system: a Python-based FastAPI backend acting as the core controller, and a React/Vite frontend acting as the security dashboard. The backend incorporates both synchronous REST endpoints and asynchronous background tasks (COSEC polling, SSE broadcasting, GPIO toggling). 

## 2. Backend Startup
- **Entrypoint**: ackend/app/main.py.
- **Application Object**: pp = FastAPI(...).
- **Invocation**: 
  - Development: uvicorn app.main:app --reload
  - Production: uvicorn app.main:app --host 0.0.0.0 --port $PORT
- **Database Initialization**: Base.metadata.create_all(bind=engine) is called synchronously at module load time (pp/main.py:23). 

## 3. Frontend Startup
- **Development Command**: 
pm run dev (Executes Vite dev server).
- **Production Build Command**: 
pm run build (Executes Vite build to dist/).
- **Backend API URL**: Relies on import.meta.env.VITE_API_URL falling back to http://localhost:8000 (rontend/src/api/config.js).
