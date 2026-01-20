from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from app.core.config import settings
from app.api.routes_health import health_router
from app.api.routes_tts import tts_router

def create_app():
    app = FastAPI(title="NusaVoice Backend")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router, tags=["health"])
    app.include_router(tts_router, tags=["tts"])

    return app

app = create_app()