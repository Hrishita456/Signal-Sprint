from __future__ import annotations

from pydantic import BaseModel


class PredictionResponse(BaseModel):
    decision: int
    label: str
    summary: str
    model_version: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: str

