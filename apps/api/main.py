from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from core.config import settings
from core.database import engine, init_db
from routers import auth, projects, generations, assets, billing, templates, team, ws, pipeline

LOCAL_MEDIA_ROOT = Path(r"D:\viewmax_media")
LOCAL_MEDIA_ROOT.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and tables
    try:
        await init_db()
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
    yield
    # Shutdown
    try:
        await engine.dispose()
    except Exception:
        pass


app = FastAPI(
    title="Viewmax API",
    description="AI Video SaaS Platform — Backend API",
    version="1.0.0",
    lifespan=lifespan,
)

app.mount("/local-media", StaticFiles(directory=str(LOCAL_MEDIA_ROOT)), name="local-media")

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router,        prefix="/api/auth",        tags=["Auth"])
app.include_router(projects.router,    prefix="/api/projects",    tags=["Projects"])
app.include_router(generations.router, prefix="/api/generate",    tags=["Generations"])
app.include_router(pipeline.router,    prefix="/api",             tags=["AI Video Pipeline"])
app.include_router(assets.router,      prefix="/api/assets",      tags=["Assets"])
app.include_router(billing.router,     prefix="/api/billing",     tags=["Billing"])
app.include_router(templates.router,   prefix="/api/templates",   tags=["Templates"])
app.include_router(team.router,        prefix="/api/team",        tags=["Team"])
app.include_router(ws.router,          prefix="/ws",              tags=["WebSocket"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "viewmax-api"}
