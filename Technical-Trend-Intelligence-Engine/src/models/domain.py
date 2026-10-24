"""
Data models for the Trend Intelligence Engine.

All models use Pydantic v2 for strict validation and serialization.
"""

from typing import Dict, List, Optional, Any, Literal
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class SpikMetrics(BaseModel):
    """Spike metric measurements."""
    star_velocity: float = Field(..., description="Stars per day (7-day average)", ge=0)
    fork_acceleration: float = Field(..., description="Fork rate acceleration ratio", ge=1.0)
    citation_spike: Optional[float] = Field(None, description="Citation increase percentage", ge=0)
    commit_velocity: float = Field(..., description="Commits per day (7-day average)", ge=0)
    engagement_score: float = Field(..., ge=0, le=1, description="Normalized engagement 0-1")
    
    class Config:
        json_schema_extra = {
            "example": {
                "star_velocity": 75.3,
                "fork_acceleration": 2.8,
                "citation_spike": 1.95,
                "commit_velocity": 12.5,
                "engagement_score": 0.78
            }
        }


class TrendObject(BaseModel):
    """Discovered trend representation."""
    trend_id: str = Field(..., description="Unique trend identifier")
    name: str = Field(..., description="Trend/project name")
    source: Literal["github", "huggingface", "community"] = Field(..., description="Data source")
    spike_metrics: SpikMetrics = Field(..., description="Computed spike metrics")
    discovery_timestamp: datetime = Field(default_factory=datetime.utcnow)
    confidence_score: float = Field(..., ge=0, le=1, description="Detection confidence")
    source_urls: List[str] = Field(default_factory=list, description="Source documentation URLs")
    description: Optional[str] = Field(None, description="Trend description")
    tags: List[str] = Field(default_factory=list, description="Classification tags")
    reasoning_trace: List[str] = Field(default_factory=list, description="Chain-of-thought steps")
    
    @field_validator('confidence_score')
    @classmethod
    def validate_confidence(cls, v: float) -> float:
        if not 0 <= v <= 1:
            raise ValueError("Confidence score must be between 0 and 1")
        return v


class ComputeProfile(BaseModel):
    """Model computational resource profile."""
    model_identifier: str = Field(..., description="Model identifier")
    inference_latency_ms: Dict[str, float] = Field(..., description="Latency by device")
    memory_gb: Dict[str, float] = Field(..., description="Memory requirements by device")
    consumer_gpu_viable: bool = Field(..., description="Fits in 16GB VRAM")
    cpu_inference_practical: bool = Field(..., description="CPU inference feasible")
    edge_device_compatible: bool = Field(..., description="Can run on edge devices")
    real_time_streaming: bool = Field(..., description="Sub-100ms latency achieved")
    bottlenecks: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


class DependencyInfo(BaseModel):
    """Dependency metadata."""
    name: str = Field(..., description="Package name")
    current_version: str = Field(..., description="Currently required version")
    latest_version: str = Field(..., description="Latest available version")
    license: Optional[str] = Field(None, description="Package license")
    is_compatible: bool = Field(default=True, description="Version compatibility status")
    is_maintained: bool = Field(default=True, description="Active maintenance status")
    last_update: datetime = Field(..., description="Last update timestamp")
    security_issues: List[str] = Field(default_factory=list)


class MaintenanceMetrics(BaseModel):
    """Project maintenance and health indicators."""
    releases_last_12mo: int = Field(..., ge=0, description="Release count in past year")
    commits_last_30d: int = Field(..., ge=0)
    active_contributors_last_30d: int = Field(..., ge=0)
    avg_issue_resolution_days: float = Field(..., ge=0)
    avg_pr_merge_time_hours: float = Field(..., ge=0)
    maintenance_velocity: Literal["high", "medium", "low", "dormant"] = Field(...)
    community_response_rate: float = Field(..., ge=0, le=1)


class ViabilityDimension(BaseModel):
    """Individual viability dimension assessment."""
    score: float = Field(..., ge=0, le=1, description="Dimension score 0-1")
    assessment: str = Field(..., description="Textual assessment")
    blockers: List[str] = Field(default_factory=list, description="Identified blockers")
    mitigations: List[str] = Field(default_factory=list, description="Mitigation strategies")


class ViabilityProfile(BaseModel):
    """Comprehensive technical viability assessment."""
    trend_id: str = Field(..., description="Reference to source trend")
    overall_score: float = Field(..., ge=0, le=1)
    classification: Literal["PRODUCTION_READY", "PROMISING", "EXPERIMENTAL", "UNFEASIBLE"] = Field(...)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Dimension scores
    compute_feasibility: ViabilityDimension = Field(...)
    integration_fit: ViabilityDimension = Field(...)
    maturity_level: ViabilityDimension = Field(...)
    maintainability: ViabilityDimension = Field(...)
    
    # Supporting data
    compute_profile: Optional[ComputeProfile] = None
    dependencies: List[DependencyInfo] = Field(default_factory=list)
    maintenance_metrics: Optional[MaintenanceMetrics] = None
    blocking_issues: List[str] = Field(default_factory=list)
    recommendations: str = Field(..., description="Actionable recommendation text")
    reasoning_trace: List[str] = Field(default_factory=list)


class ArtifactBundle(BaseModel):
    """Generated artifact collection."""
    trend_id: str = Field(...)
    model_card_markdown: str = Field(..., description="Markdown model card")
    boilerplate_code: str = Field(..., description="Python boilerplate code")
    trade_off_analysis: str = Field(..., description="Trade-off analysis markdown")
    generated_timestamp: datetime = Field(default_factory=datetime.utcnow)
    quality_metrics: Dict[str, float] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ExecutionTelemetry(BaseModel):
    """Execution telemetry and diagnostic information."""
    execution_id: str = Field(..., description="Unique execution identifier")
    start_timestamp: datetime = Field(default_factory=datetime.utcnow)
    end_timestamp: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    
    agent_logs: Dict[str, List[str]] = Field(default_factory=dict, description="Logs per agent")
    task_completions: Dict[str, bool] = Field(default_factory=dict, description="Task success status")
    errors: List[Dict[str, Any]] = Field(default_factory=list)
    
    trends_discovered: int = Field(default=0)
    trends_evaluated: int = Field(default=0)
    artifacts_generated: int = Field(default=0)
    
    chain_of_thought: Dict[str, List[str]] = Field(
        default_factory=dict,
        description="Reasoning traces by agent"
    )


class EngineConfig(BaseModel):
    """Engine configuration."""
    verbose: bool = Field(default=True, description="Enable verbose logging")
    output_dir: str = Field(default="outputs/", description="Output directory")
    cache_enabled: bool = Field(default=True)
    cache_ttl_hours: int = Field(default=24)
    
    # Source configurations
    huggingface_limit: int = Field(default=50, ge=1, le=500)
    github_limit: int = Field(default=100, ge=1, le=500)
    community_min_engagement: int = Field(default=10, ge=0)
    
    # Trend filtering
    spike_threshold: float = Field(default=1.5, ge=1.0, le=3.0)
    min_confidence: float = Field(default=0.6, ge=0, le=1)
    min_data_points: int = Field(default=7, ge=1, le=90)
    
    # Viability thresholds
    production_threshold: float = Field(default=0.8, ge=0, le=1)
    promising_threshold: float = Field(default=0.6, ge=0, le=1)
    
    class Config:
        json_schema_extra = {
            "description": "Complete engine configuration"
        }


class PipelineState(BaseModel):
    """Pipeline execution state for persistence and recovery."""
    execution_id: str = Field(...)
    stage: Literal["initialized", "scouting", "evaluating", "synthesizing", "complete"] = Field(...)
    trends: List[TrendObject] = Field(default_factory=list)
    evaluations: List[ViabilityProfile] = Field(default_factory=list)
    artifacts: List[ArtifactBundle] = Field(default_factory=list)
    last_update: datetime = Field(default_factory=datetime.utcnow)
    errors: List[Dict[str, Any]] = Field(default_factory=list)
