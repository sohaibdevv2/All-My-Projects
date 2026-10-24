"""
Data validation utilities for inputs and outputs.
"""

from typing import Any, List, Dict
from pydantic import ValidationError
from src.models.domain import TrendObject, ViabilityProfile, ArtifactBundle


def validate_trend_object(data: Dict[str, Any]) -> TrendObject:
    """Validate and construct TrendObject from raw data."""
    try:
        return TrendObject(**data)
    except ValidationError as e:
        raise ValueError(f"Invalid trend object: {e.errors()}")


def validate_viability_profile(data: Dict[str, Any]) -> ViabilityProfile:
    """Validate and construct ViabilityProfile from raw data."""
    try:
        return ViabilityProfile(**data)
    except ValidationError as e:
        raise ValueError(f"Invalid viability profile: {e.errors()}")


def validate_artifact_bundle(data: Dict[str, Any]) -> ArtifactBundle:
    """Validate and construct ArtifactBundle from raw data."""
    try:
        return ArtifactBundle(**data)
    except ValidationError as e:
        raise ValueError(f"Invalid artifact bundle: {e.errors()}")


def validate_json_structure(data: Any, expected_keys: List[str]) -> bool:
    """Validate JSON structure has required keys."""
    if not isinstance(data, dict):
        return False
    return all(key in data for key in expected_keys)


def sanitize_output(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize output to remove sensitive information."""
    # Remove API keys and tokens
    sensitive_keys = ["api_key", "token", "password", "secret"]
    
    def remove_sensitive(obj: Any) -> Any:
        if isinstance(obj, dict):
            return {
                k: remove_sensitive(v)
                for k, v in obj.items()
                if not any(sk in k.lower() for sk in sensitive_keys)
            }
        elif isinstance(obj, list):
            return [remove_sensitive(item) for item in obj]
        return obj
    
    return remove_sensitive(data)
