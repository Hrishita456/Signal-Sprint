from __future__ import annotations

import os


def get_allowed_origins() -> list[str]:
    origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173")
    return [origin.strip() for origin in origins.split(",") if origin.strip()]


def get_model_version() -> str:
    return os.getenv("MODEL_VERSION", "Signal Sprint Model v1")

