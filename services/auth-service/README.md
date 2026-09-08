# Auth Service

Handles authentication and authorization for ReelsCrafter.

## Responsibilities
- JWT token issuance and validation
- OAuth2 provider integration (Google, GitHub)
- API key management for worker-to-worker auth
- Rate limiting per user/tier

## Stack
- FastAPI
- PostgreSQL (users, sessions, api_keys tables)
- Redis (token blocklist, rate-limit counters)
