# Tool Specifications & API Reference

## Overview

This document specifies all tools available to agents, including parameter schemas, return types, error handling, and usage examples.

---

## Category: Trend Scout Tools

### Tool 1: `scrape_huggingface`

**Purpose**: Fetch and parse daily trending models and papers from Hugging Face Hub.

**Schema**:
```python
def scrape_huggingface(
    timeframe_days: int = 7,
    limit: int = 50,
    sort_by: Literal["downloads", "likes", "created"] = "downloads",
    filter_type: Literal["models", "papers", "datasets"] = "models",
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Fetch trending items from Hugging Face Hub.
    
    Parameters:
    -----------
    timeframe_days : int
        Number of days to look back for trends (default: 7)
        Valid range: 1-90
        
    limit : int
        Maximum number of items to return (default: 50)
        Valid range: 1-500
        
    sort_by : str
        Sorting criterion for results
        Options: "downloads" | "likes" | "created"
        
    filter_type : str
        Type of items to retrieve
        Options: "models" | "papers" | "datasets"
        
    api_token : str, optional
        Hugging Face API token for authenticated requests
        If None, uses HF_TOKEN environment variable
        
    Returns:
    --------
    Dict with structure:
    {
        "items": [
            {
                "id": "str",                    # Unique identifier
                "name": "str",                  # Item name
                "url": "str",                   # HF Hub URL
                "downloads": int,               # Total downloads
                "likes": int,                   # Likes count
                "created_at": "ISO-8601",      # Creation timestamp
                "updated_at": "ISO-8601",      # Last update timestamp
                "downloads_7d": int,            # 7-day download count
                "description": "str",           # Item description
                "tags": ["str"],                # Metadata tags
            }
        ],
        "metadata": {
            "total_items": int,
            "request_timestamp": "ISO-8601",
            "timeframe": int
        },
        "status": "success" | "error",
        "error": "str"  # Only if status == "error"
    }
    
    Raises:
    -------
    ValueError: If parameters out of valid range
    RuntimeError: If API request fails after 3 retries
    
    Example:
    --------
    >>> result = scrape_huggingface(
    ...     timeframe_days=7,
    ...     limit=50,
    ...     filter_type="models"
    ... )
    >>> trends = result["items"]
    """
```

**Error Handling**:
- **HTTP 429 (Rate Limit)**: Retry with exponential backoff (2s, 4s, 8s)
- **HTTP 401 (Auth Failed)**: Log error, continue with unauthenticated requests
- **Timeout**: Return last cached results if available
- **Malformed JSON**: Log and skip individual items

---

### Tool 2: `scrape_github`

**Purpose**: Fetch repository metadata and trending signals from GitHub.

**Schema**:
```python
def scrape_github(
    languages: Optional[List[str]] = None,
    since: str = "weekly",
    limit: int = 100,
    github_token: Optional[str] = None,
    include_metrics: bool = True
) -> Dict[str, Any]:
    """
    Fetch trending repositories from GitHub.
    
    Parameters:
    -----------
    languages : List[str], optional
        Filter by programming language(s)
        Examples: ["python", "javascript", "rust"]
        If None, returns cross-language trends
        
    since : str
        Trend timeframe
        Options: "daily" | "weekly" | "monthly"
        Default: "weekly"
        
    limit : int
        Maximum repositories to return (default: 100)
        Valid range: 1-500
        
    github_token : str, optional
        GitHub API token for higher rate limits
        If None, uses GITHUB_TOKEN environment variable
        
    include_metrics : bool
        If True, compute additional metrics (slower but comprehensive)
        Default: True
        
    Returns:
    --------
    Dict with structure:
    {
        "repositories": [
            {
                "repo_id": "str",               # GitHub repo ID
                "full_name": "str",             # owner/repo format
                "url": "str",                   # Repository URL
                "description": "str",
                "language": "str",              # Primary language
                "stars": int,                   # Total stars
                "forks": int,                   # Total forks
                "open_issues": int,
                "watchers": int,
                "created_at": "ISO-8601",
                "updated_at": "ISO-8601",
                "pushed_at": "ISO-8601",
                "homepage": "str",              # Project homepage
                "license": "str",               # License identifier
                "topics": ["str"],              # GitHub topics
                "metrics": {
                    "stars_7d": int,            # Stars added in 7 days
                    "forks_7d": int,            # Forks added in 7 days
                    "star_velocity": float,     # Stars per day (7d)
                    "fork_acceleration": float, # Ratio: current_rate / avg_rate
                    "commits_7d": int,          # Commits in last 7 days
                    "contributors_active": int  # Contributors in last 30 days
                }
            }
        ],
        "metadata": {
            "total_count": int,
            "request_timestamp": "ISO-8601",
            "language_filter": str
        },
        "status": "success" | "error",
        "error": "str"
    }
    
    Raises:
    -------
    ValueError: If invalid language or timeframe parameter
    RuntimeError: If API quota exceeded or auth failed
    
    Example:
    --------
    >>> result = scrape_github(
    ...     languages=["python", "javascript"],
    ...     since="weekly",
    ...     include_metrics=True
    ... )
    """
```

**Error Handling**:
- **HTTP 403 (Quota Exceeded)**: Log and halt with clear message
- **Malformed repo data**: Skip item and continue
- **Network error**: Retry up to 3 times with exponential backoff

---

### Tool 3: `scrape_communities`

**Purpose**: Aggregate trending discussions from developer communities.

**Schema**:
```python
def scrape_communities(
    sources: List[str] = ["hackernews", "producthunt", "reddit"],
    keywords: Optional[List[str]] = None,
    time_range: str = "last_7_days",
    min_engagement: int = 10,
    api_tokens: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Scrape trending topics from developer communities.
    
    Parameters:
    -----------
    sources : List[str]
        Community platforms to scrape
        Valid: ["hackernews", "producthunt", "reddit", "lobsters"]
        Default: ["hackernews", "producthunt", "reddit"]
        
    keywords : List[str], optional
        Filter discussions by keywords (AND logic)
        If None, returns top discussions without filtering
        
    time_range : str
        Time period for trend detection
        Options: "last_24_hours" | "last_7_days" | "last_30_days"
        Default: "last_7_days"
        
    min_engagement : int
        Minimum votes/comments to include (default: 10)
        Valid range: 0-10000
        
    api_tokens : Dict[str, str], optional
        API tokens for sources requiring authentication
        Keys: "producthunt", "reddit"
        
    Returns:
    --------
    Dict with structure:
    {
        "discussions": [
            {
                "id": "str",
                "title": "str",
                "source": "hackernews" | "producthunt" | "reddit" | "lobsters",
                "url": "str",
                "author": "str",
                "created_at": "ISO-8601",
                "engagement": {
                    "votes": int,               # Upvotes/score
                    "comments": int,            # Reply count
                    "engagement_score": float   # Normalized 0-1
                },
                "content_snippet": "str",       # First 200 chars
                "tags": ["str"],                # Inferred tags
                "sentiment": "positive" | "neutral" | "negative"
            }
        ],
        "metadata": {
            "total_count": int,
            "sources_queried": ["str"],
            "request_timestamp": "ISO-8601",
            "time_range": str
        },
        "status": "success" | "partial" | "error"
    }
    
    Raises:
    -------
    ValueError: If invalid source or time_range
    RuntimeError: If all sources fail to retrieve data
    
    Example:
    --------
    >>> result = scrape_communities(
    ...     sources=["hackernews", "producthunt"],
    ...     keywords=["llama", "diffusion"],
    ...     min_engagement=20
    ... )
    """
```

**Error Handling**:
- **Rate limiting**: Skip failed source, continue with others
- **Source unavailable**: Log, continue with other sources
- **API auth fail**: Ignore that source, note in metadata

---

### Tool 4: `compute_metrics`

**Purpose**: Calculate spike coefficients and trend velocity signals.

**Schema**:
```python
def compute_metrics(
    current_data: Dict[str, int],
    historical_data: List[Dict[str, Any]],
    metric_names: List[str] = ["star_velocity", "fork_acceleration", "engagement_spike"],
    baseline_window: int = 30,
    significance_threshold: float = 1.5
) -> Dict[str, Any]:
    """
    Compute spike metrics and trend signals.
    
    Parameters:
    -----------
    current_data : Dict[str, int]
        Current metrics snapshot
        Required keys: "stars", "forks", "commits", "engagement"
        
    historical_data : List[Dict[str, Any]]
        Historical daily snapshots
        Each dict must have: {"timestamp": ISO-8601, "stars": int, "forks": int, ...}
        Minimum length: 7 days
        
    metric_names : List[str]
        Metrics to compute
        Options: "star_velocity", "fork_acceleration", "commitment_velocity",
                 "citation_spike", "engagement_spike"
                 
    baseline_window : int
        Days to use for historical baseline (default: 30)
        Valid range: 7-90
        
    significance_threshold : float
        Σ threshold for spike detection (default: 1.5)
        Valid range: 1.0-3.0
        
    Returns:
    --------
    Dict with structure:
    {
        "metrics": {
            "star_velocity": {
                "current_value": float,         # Stars/day (7d average)
                "baseline_value": float,        # Historical average
                "delta": float,                 # Absolute change
                "sigma": float,                 # Standard deviations from mean
                "is_spike": bool,               # True if sigma > threshold
                "confidence": float             # 0-1 confidence score
            },
            "fork_acceleration": {
                "current_value": float,
                "baseline_value": float,
                "acceleration_ratio": float,    # current / baseline
                "is_spike": bool,
                "confidence": float
            },
            # ... additional metrics
        },
        "summary": {
            "overall_spike_score": float,       # Weighted average 0-1
            "spike_count": int,                 # Number of metrics spiking
            "trend_classification": "high" | "medium" | "low",
            "recommendation": "flag_trend" | "monitor" | "ignore"
        },
        "diagnostic": {
            "data_points_used": int,
            "baseline_std_dev": float,
            "timestamp": "ISO-8601"
        }
    }
    
    Raises:
    -------
    ValueError: If data insufficient (<7 days) or invalid thresholds
    
    Example:
    --------
    >>> metrics = compute_metrics(
    ...     current_data={"stars": 1500, "forks": 120, "commits": 45},
    ...     historical_data=[...],
    ...     metric_names=["star_velocity", "fork_acceleration"]
    ... )
    """
```

**Calculation Formulas**:
- **Star Velocity**: (sum of daily stars over 7 days) / 7
- **Fork Acceleration**: (fork_rate_t / fork_rate_t-7)
- **Sigma Calculation**: (current - mean) / std_dev

---

## Category: Technical Viability Tools

### Tool 5: `extract_architecture`

**Purpose**: Parse and extract architectural components from documentation and code.

**Schema**:
```python
def extract_architecture(
    repo_url: str,
    extract_sections: bool = True,
    parse_code_samples: bool = True,
    depth: int = 2
) -> Dict[str, Any]:
    """
    Extract architecture details from repository documentation and code.
    
    Parameters:
    -----------
    repo_url : str
        Full GitHub repository URL or owner/repo format
        
    extract_sections : bool
        If True, extract README sections (architecture, components, etc.)
        Default: True
        
    parse_code_samples : bool
        If True, parse code examples for API surface discovery
        Default: True
        
    depth : int
        Directory depth to analyze for code patterns
        Valid range: 1-5
        Default: 2
        
    Returns:
    --------
    Dict with structure:
    {
        "repository": {
            "name": "str",
            "url": "str",
            "readme": "str"                     # Full README content
        },
        "architecture": {
            "description": "str",               # Extracted architecture description
            "components": ["str"],              # Key components identified
            "layers": ["str"],                  # Identified architectural layers
            "entry_points": ["str"],            # Main entry functions/classes
            "diagram_description": "str"        # Description for ASCII diagram
        },
        "code_analysis": {
            "main_files": ["str"],              # Key implementation files
            "primary_classes": [
                {"name": "str", "methods": ["str"], "docstring": "str"}
            ],
            "api_surface": ["str"],             # Public API endpoints
            "error_handling_patterns": ["str"]  # Found exception patterns
        },
        "documentation": {
            "completeness_score": float,        # 0-1 documentation quality
            "has_examples": bool,
            "has_api_reference": bool,
            "has_architecture_guide": bool
        },
        "quality_indicators": {
            "type_hints_coverage": float,       # % of functions with type hints
            "docstring_coverage": float,        # % of functions with docstrings
            "test_coverage": float              # Estimated test coverage
        }
    }
    
    Raises:
    -------
    ValueError: If invalid repo_url format
    RuntimeError: If unable to fetch repository
    
    Example:
    --------
    >>> arch = extract_architecture(
    ...     repo_url="pytorch/pytorch",
    ...     extract_sections=True
    ... )
    """
```

---

### Tool 6: `profile_compute`

**Purpose**: Profile computational requirements and resource constraints.

**Schema**:
```python
def profile_compute(
    model_identifier: str,
    target_devices: List[str] = ["cuda", "cpu"],
    batch_sizes: List[int] = [1, 8, 32],
    input_sizes: Optional[Dict[str, int]] = None,
    run_benchmark: bool = False
) -> Dict[str, Any]:
    """
    Profile model computational requirements.
    
    Parameters:
    -----------
    model_identifier : str
        Model ID (HF format) or local path
        Examples: "meta-llama/Llama-2-7b", "openai/whisper-large"
        
    target_devices : List[str]
        Devices to profile for
        Options: "cuda", "cpu", "mps", "tpu"
        Default: ["cuda", "cpu"]
        
    batch_sizes : List[int]
        Batch sizes to test (default: [1, 8, 32])
        
    input_sizes : Dict[str, int], optional
        Input dimensions for profiling
        Keys: "sequence_length", "image_size", etc.
        
    run_benchmark : bool
        If True, run actual benchmarks (slower but accurate)
        Default: False (uses model card estimates)
        
    Returns:
    --------
    Dict with structure:
    {
        "model_id": "str",
        "profiling_results": {
            "inference_latency": {
                "cuda": {
                    "batch_1": {"latency_ms": float, "throughput": float},
                    "batch_8": {...},
                    "batch_32": {...}
                },
                "cpu": {...}
            },
            "memory_requirements": {
                "model_size_gb": float,
                "cuda": {
                    "batch_1": {"memory_gb": float},
                    "batch_8": {"memory_gb": float}
                }
            },
            "optimization_opportunities": {
                "quantization": {
                    "int8_speedup": float,
                    "int4_speedup": float,
                    "quality_loss": "string"
                },
                "distillation": {
                    "potential_speedup": float,
                    "recommended_target": "str"
                }
            }
        },
        "feasibility_assessment": {
            "consumer_gpu_viable": bool,        # Fits in 16GB VRAM
            "cpu_inference_practical": bool,    # Latency < 5s
            "edge_device_compatible": bool,     # Quantizable to <2GB
            "real_time_streaming": bool         # Latency < 100ms
        },
        "bottlenecks": ["str"],                 # Identified constraints
        "recommendations": ["str"]              # Optimization suggestions
    }
    
    Raises:
    -------
    RuntimeError: If unable to load model
    
    Example:
    --------
    >>> profile = profile_compute(
    ...     model_identifier="meta-llama/Llama-2-7b",
    ...     target_devices=["cuda"],
    ...     run_benchmark=False
    ... )
    """
```

---

### Tool 7: `analyze_dependencies`

**Purpose**: Build and analyze dependency graph for blockers and compatibility issues.

**Schema**:
```python
def analyze_dependencies(
    repo_url: str,
    requirements_files: List[str] = ["requirements.txt", "pyproject.toml", "setup.py"],
    check_licenses: bool = True,
    max_depth: int = 3
) -> Dict[str, Any]:
    """
    Analyze project dependencies for compatibility and licenses.
    
    Parameters:
    -----------
    repo_url : str
        Repository URL or path
        
    requirements_files : List[str]
        Files to parse for dependencies
        
    check_licenses : bool
        If True, check license compatibility
        Default: True
        
    max_depth : int
        Maximum depth for transitive dependency analysis
        Valid range: 1-5
        Default: 3
        
    Returns:
    --------
    Dict with structure:
    {
        "dependency_summary": {
            "direct_count": int,
            "transitive_count": int,
            "total_unique": int
        },
        "dependencies": [
            {
                "name": "str",
                "current_version": "str",
                "required_version": "str",
                "latest_version": "str",
                "license": "str",
                "is_compatible": bool,
                "is_maintained": bool,
                "last_update": "ISO-8601",
                "security_issues": ["str"]
            }
        ],
        "blocking_issues": [
            {
                "severity": "critical" | "high" | "medium" | "low",
                "dependency": "str",
                "issue": "str",
                "mitigation": "str"
            }
        ],
        "license_analysis": {
            "licenses": {"license_name": count},
            "compatible_with": ["license"],     # Compatible OSS licenses
            "incompatible_with": ["license"],   # Incompatible licenses found
            "proprietary_risk": bool
        },
        "recommendations": ["str"]
    }
    
    Raises:
    -------
    ValueError: If no requirements files found
    
    Example:
    --------
    >>> deps = analyze_dependencies(
    ...     repo_url="pytorch/pytorch",
    ...     check_licenses=True
    ... )
    """
```

---

### Tool 8: `assess_maturity`

**Purpose**: Evaluate project maturity and maintenance health.

**Schema**:
```python
def assess_maturity(
    repo_url: str,
    lookback_months: int = 12
) -> Dict[str, Any]:
    """
    Assess project maturity and maintenance status.
    
    Parameters:
    -----------
    repo_url : str
        Repository URL
        
    lookback_months : int
        Time period for historical analysis (default: 12)
        Valid range: 1-60
        
    Returns:
    --------
    Dict with structure:
    {
        "maturity_indicators": {
            "release_history": {
                "total_releases": int,
                "releases_last_12mo": int,
                "avg_days_between_releases": float,
                "latest_release": "ISO-8601",
                "release_regularity": "regular" | "sporadic" | "stale"
            },
            "maintenance_activity": {
                "commits_last_30d": int,
                "commits_last_90d": int,
                "commits_last_12mo": int,
                "active_contributors_last_30d": int,
                "maintenance_velocity": "high" | "medium" | "low" | "dormant"
            },
            "community_engagement": {
                "open_issues": int,
                "avg_issue_resolution_days": float,
                "avg_pr_merge_time_hours": float,
                "pull_requests_open": int,
                "community_response_rate": float  # 0-1
            }
        },
        "classification": {
            "stability_status": "stable" | "beta" | "alpha" | "dormant",
            "recommended_for": "production" | "production_with_caution" | "proof_of_concept" | "not_recommended",
            "adoption_risk": "low" | "medium" | "high"
        },
        "red_flags": ["str"],                   # Concerning indicators
        "green_flags": ["str"],                 # Positive indicators
        "recommendations": ["str"]
    }
    
    Example:
    --------
    >>> maturity = assess_maturity(repo_url="pytorch/pytorch")
    """
```

---

### Tool 9: `calculate_viability_score`

**Purpose**: Compute final viability score from dimension assessments.

**Schema**:
```python
def calculate_viability_score(
    compute_feasibility: float,
    integration_fit: float,
    maturity_level: float,
    maintainability: float,
    weights: Dict[str, float] = {
        "compute": 0.3,
        "integration": 0.3,
        "maturity": 0.2,
        "maintain": 0.2
    }
) -> Dict[str, Any]:
    """
    Calculate final viability score with weighted dimensions.
    
    Parameters:
    -----------
    compute_feasibility : float
        Compute dimension score (0-1)
        
    integration_fit : float
        Integration dimension score (0-1)
        
    maturity_level : float
        Maturity dimension score (0-1)
        
    maintainability : float
        Maintainability dimension score (0-1)
        
    weights : Dict[str, float]
        Custom weights for dimensions
        Must sum to 1.0
        
    Returns:
    --------
    Dict with structure:
    {
        "overall_score": float,                 # 0-1
        "classification": "PRODUCTION_READY" | "PROMISING" | "EXPERIMENTAL" | "UNFEASIBLE",
        "score_breakdown": {
            "compute_feasibility": {"score": float, "weight": float, "contribution": float},
            "integration_fit": {...},
            "maturity_level": {...},
            "maintainability": {...}
        },
        "percentile_rank": float,               # Against historical trends
        "confidence_interval": [float, float],  # 95% CI
        "recommendation": "str"                 # Actionable guidance
    }
    """
```

---

## Category: Artifact Synthesis Tools

### Tool 10: `generate_model_card`

**Purpose**: Generate human-readable model card documentation.

**Schema**:
```python
def generate_model_card(
    trend_id: str,
    viability_profile: Dict[str, Any],
    trend_metadata: Dict[str, Any],
    include_sections: List[str] = [
        "quick_overview",
        "technical_specs",
        "architecture",
        "integration_complexity",
        "blockers",
        "community"
    ]
) -> Dict[str, Any]:
    """
    Generate minimalist model card in Markdown format.
    
    Parameters:
    -----------
    trend_id : str
        Unique trend identifier
        
    viability_profile : Dict[str, Any]
        Output from technical viability assessment
        
    trend_metadata : Dict[str, Any]
        Trend data including metrics and sources
        
    include_sections : List[str]
        Sections to include in model card
        
    Returns:
    --------
    Dict with structure:
    {
        "model_card_markdown": "str",           # Full Markdown content
        "metadata": {
            "generated_timestamp": "ISO-8601",
            "template_version": "1.0",
            "sections_included": ["str"]
        },
        "quality_metrics": {
            "readability_score": float,
            "completeness": float,
            "structure_validity": bool
        }
    }
    
    Example:
    --------
    >>> card = generate_model_card(
    ...     trend_id="trend_001",
    ...     viability_profile={...},
    ...     trend_metadata={...}
    ... )
    >>> markdown = card["model_card_markdown"]
    """
```

---

### Tool 11: `create_boilerplate`

**Purpose**: Generate production-ready boilerplate code setup.

**Schema**:
```python
def create_boilerplate(
    trend_name: str,
    primary_use_case: str,
    target_framework: str = "pytorch",
    include_components: List[str] = [
        "config_management",
        "model_loading",
        "inference_pipeline",
        "error_handling",
        "logging"
    ],
    style_preset: str = "minimal_enterprise"
) -> Dict[str, Any]:
    """
    Generate production-ready boilerplate code template.
    
    Parameters:
    -----------
    trend_name : str
        Name of trend/model for code generation
        
    primary_use_case : str
        Primary application context
        
    target_framework : str
        ML framework target
        Options: "pytorch", "tensorflow", "huggingface", "jax"
        
    include_components : List[str]
        Components to generate
        
    style_preset : str
        Code style template
        Options: "minimal_enterprise", "verbose", "async"
        
    Returns:
    --------
    Dict with structure:
    {
        "boilerplate_code": "str",              # Complete Python code
        "metadata": {
            "generated_timestamp": "ISO-8601",
            "components": ["str"],
            "lines_of_code": int
        },
        "documentation": {
            "setup_instructions": "str",
            "usage_examples": "str",
            "configuration_guide": "str"
        },
        "quality_metrics": {
            "type_hint_coverage": float,
            "error_handling_blocks": int,
            "cyclomatic_complexity": float
        }
    }
    
    Example:
    --------
    >>> boilerplate = create_boilerplate(
    ...     trend_name="StableDiffusion",
    ...     primary_use_case="image_generation",
    ...     target_framework="pytorch"
    ... )
    """
```

---

### Tool 12: `build_trade_off_table`

**Purpose**: Generate comparative trade-off analysis documentation.

**Schema**:
```python
def build_trade_off_table(
    viability_profile: Dict[str, Any],
    trend_metadata: Dict[str, Any],
    comparison_peers: Optional[List[str]] = None,
    include_sections: List[str] = [
        "performance_vs_maintainability",
        "implementation_roadmap",
        "decision_matrix"
    ]
) -> Dict[str, Any]:
    """
    Generate trade-off analysis table.
    
    Parameters:
    -----------
    viability_profile : Dict[str, Any]
        From technical viability assessment
        
    trend_metadata : Dict[str, Any]
        Trend information
        
    comparison_peers : List[str], optional
        Other trends to compare against
        
    include_sections : List[str]
        Sections to include
        
    Returns:
    --------
    Dict with structure:
    {
        "trade_off_analysis_markdown": "str",  # Full Markdown tables
        "metadata": {
            "generated_timestamp": "ISO-8601",
            "sections": ["str"]
        },
        "decision_framework": {
            "go_recommendation": bool,
            "confidence": float,
            "next_steps": ["str"]
        }
    }
    
    Example:
    --------
    >>> analysis = build_trade_off_table(
    ...     viability_profile={...},
    ...     trend_metadata={...}
    ... )
    """
```

---

## Error Codes & Recovery

### Standard Error Codes

| Code | Name | Recovery |
|------|------|----------|
| 4001 | RATE_LIMIT | Exponential backoff + retry |
| 4002 | AUTH_FAILED | Log and continue with degraded functionality |
| 4003 | MALFORMED_DATA | Skip item, continue processing |
| 5001 | NETWORK_ERROR | Retry 3x, then return cached results |
| 5002 | API_UNAVAILABLE | Skip source, continue with others |
| 6001 | INSUFFICIENT_DATA | Flag in output, request manual review |

---

## Tool Usage Patterns

### Sequential Dependency Chain

```
scrape_* tools
    ↓ (outputs trend objects)
compute_metrics
    ↓ (filtered trends)
extract_architecture + profile_compute + analyze_dependencies (parallel)
    ↓ (convergence point)
assess_maturity + calculate_viability_score
    ↓ (finalized scores)
generate_model_card + create_boilerplate + build_trade_off_table (parallel)
    ↓
Return artifacts
```

### Caching Strategy

- Results cached for 24 hours
- Force refresh with `force_refresh=True` parameter
- Cache invalidation on dependency updates

### Timeout Values

- Scraper tools: 60 seconds
- Profiling tools: 300 seconds
- Generation tools: 30 seconds
