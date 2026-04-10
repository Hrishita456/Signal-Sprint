from __future__ import annotations

import importlib.util
import os
import sys
from functools import lru_cache
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "model_artifacts"
PREDICT_PATH = MODEL_DIR / "predict.py"


@lru_cache(maxsize=1)
def get_predict_module():
    spec = importlib.util.spec_from_file_location("predict", PREDICT_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("Unable to load predict.py from model_artifacts.")

    module = importlib.util.module_from_spec(spec)
    sys.modules["predict"] = module
    spec.loader.exec_module(module)
    return module


@lru_cache(maxsize=1)
def get_model():
    predict_module = get_predict_module()
    return predict_module.load_model()


def is_model_loaded() -> bool:
    return get_model.cache_info().currsize > 0


def run_prediction(image_path: str) -> int:
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    predict_module = get_predict_module()
    model = get_model()
    return int(predict_module.predict(model, image_path))


def get_label(decision: int) -> str:
    return "Action required" if decision == 1 else "No action required"


def get_summary(decision: int) -> str:
    if decision == 1:
        return "Garbage spill or unauthorized dumping may require municipal action."
    return "The area appears contained, with no action-triggering waste condition detected."
