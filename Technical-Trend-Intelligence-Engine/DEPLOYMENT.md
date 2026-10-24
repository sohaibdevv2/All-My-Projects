# Deployment & Implementation Guide

## Quick Start

### 1. Setup

```bash
# Clone/navigate to project
cd trend-intelligence-engine

# Create virtual environment
python3.10+ -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your API keys:
#   - OPENAI_API_KEY
#   - GITHUB_TOKEN
#   - HUGGINGFACE_TOKEN
```

### 2. Run the Engine

```bash
# Basic execution
python main.py

# With verbose logging
python main.py --verbose

# Custom output directory
python main.py --output-dir ./my-results

# With custom thresholds
python main.py --spike-threshold 2.0 --min-confidence 0.7
```

### 3. Access Results

Results are saved to `outputs/` directory:
```
outputs/
├── results.json                      # Complete execution data
├── artifact_000_gh_12345/           # Per-trend artifacts
│   ├── model_card.md
│   ├── boilerplate_setup.py
│   └── trade_off_analysis.md
├── artifact_001_hf_67890/
│   ├── model_card.md
│   ├── boilerplate_setup.py
│   └── trade_off_analysis.md
└── ...
```

---

## Architecture Overview

The system operates in three distinct stages:

### Stage 1: Trend Scouting (Parallel)
- **Agents**: TrendScoutAgent
- **Data Sources**:
  - GitHub API (repositories, trends)
  - Hugging Face Hub (models, papers)
  - Developer Communities (Hacker News, etc.)
- **Output**: List of `TrendObject` with spike metrics
- **Duration**: 15-30 seconds

### Stage 2: Technical Viability Assessment (Sequential)
- **Agent**: TechnicalViabilityAgent
- **Evaluation Dimensions**:
  - Compute Feasibility (30% weight)
  - Integration Fit (30% weight)
  - Maturity Level (20% weight)
  - Maintainability (20% weight)
- **Output**: `ViabilityProfile` per trend
- **Classification**: PRODUCTION_READY | PROMISING | EXPERIMENTAL | UNFEASIBLE
- **Duration**: 20-45 seconds per trend

### Stage 3: Artifact Synthesis (Parallel)
- **Agent**: ArtifactSynthesizerAgent
- **Artifacts Generated**:
  1. Model Card (Markdown technical overview)
  2. Boilerplate Code (Python production setup)
  3. Trade-off Analysis (Decision matrix)
- **Output**: `ArtifactBundle` per trend
- **Duration**: 5-10 seconds per trend

---

## Key Metrics & Thresholds

### Spike Detection

| Metric | Calculation | Default Threshold |
|--------|-------------|-------------------|
| Star Velocity | Δ stars / Δ days | > 50 stars/day |
| Fork Acceleration | fork_rate_t / fork_rate_t-7 | > 2.0x |
| Citation Spike | (current - baseline) / baseline | > 150% |
| Sigma (σ) | Standard deviations from mean | > 1.5σ |

### Confidence Scoring

```
confidence_score = (engagement_spike_detected × 0.4) +
                   (velocity_magnitude × 0.3) +
                   (data_quality × 0.3)
```

- **High Confidence**: > 0.8 (strong signal)
- **Medium Confidence**: 0.6-0.8 (reasonable signal)
- **Low Confidence**: < 0.6 (filtered by default)

---

## Configuration Guide

### Environment Variables

```bash
# LLM Configuration
export OPENAI_API_KEY="sk-..."
export LLM_MODEL="gpt-4"
export LLM_TEMPERATURE="0.3"  # Lower = more deterministic

# API Tokens
export GITHUB_TOKEN="ghp_..."
export HUGGINGFACE_TOKEN="hf_..."

# Engine Behavior
export VERBOSE="true"                    # Enable detailed logging
export SPIKE_THRESHOLD="1.5"            # σ threshold for spike detection
export MIN_CONFIDENCE="0.6"             # Minimum confidence score filter
export BASELINE_WINDOW_DAYS="30"        # Historical baseline window

# Source Limits
export GITHUB_LIMIT="100"               # Max repos per scrape
export HUGGINGFACE_LIMIT="50"           # Max models per scrape
export COMMUNITY_MIN_ENGAGEMENT="10"    # Min votes/comments

# Viability Thresholds
export PRODUCTION_THRESHOLD="0.8"       # Score for PRODUCTION_READY
export PROMISING_THRESHOLD="0.6"        # Score for PROMISING
```

### Programmatic Configuration

```python
from src.config.settings import EngineSettings

# Override before running engine
EngineSettings.SPIKE_THRESHOLD = 2.0
EngineSettings.MIN_CONFIDENCE = 0.7
EngineSettings.VERBOSE = True
EngineSettings.ensure_directories()
```

---

## Tool Usage Reference

### TrendScoutAgent Tools

**`scrape_github(languages, since, limit)`**
- Fetches trending repositories from GitHub
- Computes spike metrics (star velocity, fork acceleration)
- Returns: List of `TrendObject` with GitHub metrics

**`scrape_huggingface(timeframe_days, limit, filter_type)`**
- Fetches trending models/papers from Hugging Face Hub
- Extracts download/engagement signals
- Returns: List of `TrendObject` with HF metrics

**`scrape_communities(sources, keywords, time_range)`**
- Fetches discussions from Hacker News, Product Hunt, Reddit
- Computes engagement scores
- Returns: List of `TrendObject` with community metrics

**`compute_metrics(current_data, historical_data, baseline_window)`**
- Calculates spike coefficients and trend velocity
- Performs statistical significance testing
- Returns: Spike metrics and classification

### TechnicalViabilityAgent Tools

**`extract_architecture(repo_url, depth)`**
- Parses README and code for architecture
- Identifies components, layers, entry points
- Returns: Architecture profile

**`profile_compute(model_identifier, target_devices, batch_sizes)`**
- Profiles inference latency and memory
- Assesses optimization opportunities
- Returns: Computational feasibility profile

**`analyze_dependencies(repo_url, max_depth)`**
- Builds dependency graph
- Checks licenses, security issues
- Returns: Dependency analysis with blockers

**`assess_maturity(repo_url, lookback_months)`**
- Analyzes maintenance activity
- Computes community engagement metrics
- Returns: Maturity classification

**`calculate_viability_score(dimensions, weights)`**
- Combines dimension scores with weights
- Classifies overall viability
- Returns: Final viability classification

### ArtifactSynthesizerAgent Tools

**`generate_model_card(trend_name, viability_profile, trend_data)`**
- Creates Markdown technical overview
- Includes specifications, blockers, recommendations
- Returns: Complete model card

**`create_boilerplate(trend_name, use_case, framework)`**
- Generates Python boilerplate code
- Includes error handling, logging, type hints
- Returns: Production-ready setup script

**`build_trade_off_table(viability_profile, comparison_peers)`**
- Creates decision matrix
- Documents implementation roadmap
- Returns: Trade-off analysis markdown

---

## Error Handling & Recovery

### Automatic Retry Logic

```python
# Exponential backoff: 2s, 4s, 8s
# Maximum 3 retries
# Timeout: 60 seconds per request

delay = base_delay ^ attempt
# Example: 2^0=1s, 2^1=2s, 2^2=4s
```

### Graceful Degradation

- **API Rate Limit**: Skip source, continue with others
- **Missing Data**: Filter item, proceed
- **Network Error**: Use cached results if available
- **Malformed JSON**: Log error, skip record

### Logging Strategy

```
logs/
├── engine.log           # Main orchestrator logs
├── agent_trend_scout_v1.log
├── agent_technical_viability_v1.log
├── agent_artifact_synthesizer_v1.log
└── errors.log          # Critical errors only
```

---

## Performance Optimization

### Parallel Execution

```python
# Stage 1: Parallel scraping
gather([
    scrape_github(),
    scrape_huggingface(),
    scrape_communities()
])

# Stage 3: Parallel artifact generation
gather([
    generate_model_card(trend1),
    generate_model_card(trend2),
    ...
])
```

### Expected Runtimes

- Trend Scouting: 20-40 seconds
- Technical Viability (per trend): 5-15 seconds
- Artifact Synthesis (per trend): 3-8 seconds
- Total (3 trends): ~60-120 seconds

### Memory Usage

- Per-trend state: ~2 MB
- Full execution (10 trends): ~50 MB
- Cache size: Bounded to 500 MB

---

## Production Deployment Checklist

- [ ] API credentials validated and stored in secrets manager
- [ ] Logging configured for production (no PII in logs)
- [ ] Output directory permissions verified
- [ ] Rate limiting configured for external APIs
- [ ] Error handling and retry logic tested
- [ ] Data retention/purge policies implemented
- [ ] Monitoring/alerting configured
- [ ] Backup strategy for artifacts
- [ ] Documentation updated with custom thresholds
- [ ] Load testing completed for peak load

---

## Troubleshooting

### Issue: "Missing required credentials: OPENAI_API_KEY"
**Solution**: Set environment variable or add to `.env` file
```bash
export OPENAI_API_KEY="sk-..."
```

### Issue: "HTTP 429 (Rate Limited)"
**Solution**: Automatic retry with exponential backoff is built-in. Increase `REQUEST_MAX_RETRIES` if needed.

### Issue: "No trends discovered"
**Solution**: Lower thresholds:
```bash
python main.py --spike-threshold 1.0 --min-confidence 0.4
```

### Issue: "Timeout after 300 seconds"
**Solution**: Increase timeout or run with fewer sources:
```bash
python main.py --timeout 600
```

---

## Advanced Usage

### Custom Source Integration

```python
# Add new data source in scrapers.py
class CustomScraper(DataScraperBase):
    async def fetch_custom_data(self):
        # Implementation
        pass

# Register in TrendScoutAgent
trends.extend(await custom_scraper.fetch_custom_data())
```

### Custom Evaluation Metrics

```python
# Extend technical_viability_agent.py
async def _score_custom_dimension(self, trend: TrendObject) -> float:
    # Custom scoring logic
    return score
```

### Artifact Customization

```python
# Modify generators.py templates
CUSTOM_TEMPLATE = """# Custom {trend_name}
..."""
```

---

## References

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Detailed system design
- [SYSTEM_PROMPTS.md](docs/SYSTEM_PROMPTS.md) - Agent prompts and configurations
- [TOOL_SPECIFICATIONS.md](docs/TOOL_SPECIFICATIONS.md) - Complete tool API reference
- [README.md](README.md) - Project overview
