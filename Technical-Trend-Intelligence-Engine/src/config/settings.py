"""
Configuration management for the Trend Intelligence Engine.
"""

import os
from pathlib import Path
from typing import Dict, Any
import json
from pydantic import BaseModel


class EngineSettings:
    """Global engine settings loaded from environment and config files."""
    
    # API Credentials
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    HUGGINGFACE_TOKEN: str = os.getenv("HUGGINGFACE_TOKEN", "")
    
    # Service Endpoints
    GITHUB_API_URL: str = "https://api.github.com"
    HUGGINGFACE_API_URL: str = "https://huggingface.co/api"
    
    # Paths
    PROJECT_ROOT: Path = Path(__file__).parent.parent.parent
    OUTPUT_DIR: Path = PROJECT_ROOT / "outputs"
    CACHE_DIR: Path = PROJECT_ROOT / ".cache"
    LOG_DIR: Path = PROJECT_ROOT / "logs"
    
    # Execution
    VERBOSE: bool = os.getenv("VERBOSE", "true").lower() == "true"
    MAX_WORKERS: int = int(os.getenv("MAX_WORKERS", "4"))
    REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", "60"))
    
    # LLM Configuration
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4")
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.3"))
    LLM_MAX_TOKENS: int = int(os.getenv("LLM_MAX_TOKENS", "4000"))
    
    # Trend Detection Thresholds
    SPIKE_THRESHOLD: float = float(os.getenv("SPIKE_THRESHOLD", "1.5"))
    MIN_CONFIDENCE: float = float(os.getenv("MIN_CONFIDENCE", "0.6"))
    MIN_DATA_POINTS: int = int(os.getenv("MIN_DATA_POINTS", "7"))
    BASELINE_WINDOW_DAYS: int = int(os.getenv("BASELINE_WINDOW_DAYS", "30"))
    
    # Viability Scoring
    COMPUTE_WEIGHT: float = 0.3
    INTEGRATION_WEIGHT: float = 0.3
    MATURITY_WEIGHT: float = 0.2
    MAINTAIN_WEIGHT: float = 0.2
    
    PRODUCTION_THRESHOLD: float = 0.8
    PROMISING_THRESHOLD: float = 0.6
    EXPERIMENTAL_THRESHOLD: float = 0.4
    
    # Caching
    CACHE_ENABLED: bool = os.getenv("CACHE_ENABLED", "true").lower() == "true"
    CACHE_TTL_HOURS: int = int(os.getenv("CACHE_TTL_HOURS", "24"))
    
    # Rate Limiting
    REQUEST_BACKOFF_BASE: float = 2.0
    REQUEST_MAX_RETRIES: int = 3
    
    @classmethod
    def ensure_directories(cls) -> None:
        """Create necessary directories if they don't exist."""
        cls.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        cls.CACHE_DIR.mkdir(parents=True, exist_ok=True)
        cls.LOG_DIR.mkdir(parents=True, exist_ok=True)
    
    @classmethod
    def validate_credentials(cls) -> bool:
        """Validate that required credentials are available."""
        required = ["OPENAI_API_KEY"]
        missing = [key for key in required if not getattr(cls, key, "")]
        if missing:
            raise RuntimeError(f"Missing required credentials: {missing}")
        return True
    
    @classmethod
    def to_dict(cls) -> Dict[str, Any]:
        """Export settings as dictionary (excludes sensitive data)."""
        return {
            key: getattr(cls, key)
            for key in dir(cls)
            if key.isupper() and not key.startswith("_") and key not in ["OPENAI_API_KEY", "GITHUB_TOKEN", "HUGGINGFACE_TOKEN"]
        }


class CrewAIConfig(BaseModel):
    """CrewAI framework configuration."""
    
    verbose: bool = EngineSettings.VERBOSE
    log_level: str = "INFO"
    max_iter: int = 5
    memory: bool = True
    
    class Config:
        json_schema_extra = {
            "description": "Configuration for CrewAI orchestrator"
        }


class RetryPolicy:
    """Exponential backoff retry policy."""
    
    def __init__(
        self,
        base_delay: float = EngineSettings.REQUEST_BACKOFF_BASE,
        max_retries: int = EngineSettings.REQUEST_MAX_RETRIES
    ):
        self.base_delay = base_delay
        self.max_retries = max_retries
    
    def get_delay(self, attempt: int) -> float:
        """Get delay in seconds for attempt number."""
        return min(self.base_delay ** attempt, 300)  # Cap at 5 minutes
    
    def should_retry(self, attempt: int, exception: Exception) -> bool:
        """Determine if request should be retried."""
        if attempt >= self.max_retries:
            return False
        
        # Retry on transient errors
        retryable = {
            TimeoutError,
            ConnectionError,
            Exception  # Temporary: retry all for robustness
        }
        return isinstance(exception, tuple(retryable))


def load_agent_prompts() -> Dict[str, Dict[str, str]]:
    """Load agent system prompts from configuration."""
    return {
        "trend_scout": {
            "role": "Trend Scout",
            "goal": "Detect emerging technology trends via spike metrics analysis",
            "backstory": """You have 10+ years of experience tracking open-source adoption curves.
You understand GitHub metrics deeply, recognize bot patterns, and can distinguish
between viral moments and sustainable trends. You're meticulous with statistical
validation before flagging a discovery.""",
        },
        "technical_viability": {
            "role": "Technical Viability Architect",
            "goal": "Assess production readiness and technical feasibility of emerging trends",
            "backstory": """You are a seasoned systems architect with 15+ years building scalable 
infrastructure. You've deployed models to production across diverse hardware, managed
complex dependency trees, and know the hidden costs of technical debt. You're skeptical
of hype and base recommendations on rigorous technical analysis.""",
        },
        "artifact_synthesizer": {
            "role": "Analytics & Artifact Synthesizer",
            "goal": "Convert technical evaluations into production-ready intelligence artifacts",
            "backstory": """You are a technical writer and architect with expertise in making 
complex systems accessible. You've written 100+ model cards, generated production 
boilerplate for diverse tech stacks, and distilled architectural complexity into 
decision matrices. You prioritize clarity, completeness, and enterprise quality.""",
        }
    }


# Initialize settings on import
EngineSettings.ensure_directories()
