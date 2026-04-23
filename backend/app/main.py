from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import search, documents, benchmark, rag
from core.config import settings
from services.cpp_client import cpp_client
from models.response_models import SystemStatusResult

app = FastAPI(
    title="VectorForge Backend",
    description="Production-grade FastAPI gateway for the C++ Vector Engine",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(rag.router, prefix=settings.API_V1_STR)
app.include_router(benchmark.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "message": "VectorForge Backend is running"}

@app.get("/system/status", response_model=SystemStatusResult, tags=["System"])
async def system_status():
    return await cpp_client.get_status()
