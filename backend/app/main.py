from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.api_router import api_router
from app.core.config import settings
from app.core.exceptions import BankingCopilotException
from app.core.logging import logger
from app.database.session import AsyncSessionLocal, init_db
from app.seed.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed realistic data
    logger.info("Starting Banking Copilot backend service...")
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed_database(session)
    logger.info("Database initialized and verified.")
    yield
    # Shutdown
    logger.info("Shutting down Banking Copilot backend service...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Conversational Banking Copilot Platform with AI Orchestration, PostgreSQL, and Predictive Analytics",
    lifespan=lifespan,
)

# Enable CORS for React Native mobile client & local tooling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(BankingCopilotException)
async def banking_exception_handler(request: Request, exc: BankingCopilotException):
    return JSONResponse(
        status_code=400,
        content={"error": exc.code, "message": exc.message},
    )


@app.get("/")
async def root():
    from app.ai.function_calling import LLMFunctionCallingClient
    llm = LLMFunctionCallingClient()
    return {
        "service": "Banking Copilot API",
        "version": settings.VERSION,
        "status": "healthy",
        "llm_provider": llm.provider_name,
        "model": llm.model_name or "local_engine",
        "documentation": "/docs",
    }


# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)
