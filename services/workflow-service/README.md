# Workflow Service

Manages the 20-stage DAG pipeline execution and checkpoint persistence.

## Responsibilities
- Schedules and coordinates pipeline stages
- Persists checkpoints to PostgreSQL for resumability
- Exposes WebSocket stream for real-time progress updates
- Handles partial reruns from any checkpoint

## Stack
- FastAPI + WebSocket
- PostgreSQL (pipeline_jobs, checkpoints tables)
- Redis (stage pub/sub events)
