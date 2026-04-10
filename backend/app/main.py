from __future__ import annotations

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .config import get_allowed_origins, get_model_version
from .model_service import get_label, get_summary, is_model_loaded, run_prediction
from .schemas import HealthResponse, PredictionResponse


app = FastAPI(
    title="Signal Sprint API",
    description="FastAPI wrapper around the provided Signal Sprint model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["meta"])
def root():
    return {
        "name": "Signal Sprint API",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", response_model=HealthResponse, tags=["meta"])
def health_check():
    return HealthResponse(
        status="ok",
        model_loaded=is_model_loaded(),
        model_version=get_model_version(),
    )


@app.post("/predict", response_model=PredictionResponse, tags=["inference"])
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file.")

    suffix = Path(file.filename or "upload").suffix or ".jpg"
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_path = temp_file.name
            content = await file.read()
            temp_file.write(content)

        decision = run_prediction(temp_path)
        return PredictionResponse(
            decision=decision,
            label=get_label(decision),
            summary=get_summary(decision),
            model_version=get_model_version(),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
