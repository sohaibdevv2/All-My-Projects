"""
Main entry point for the Trend Intelligence Engine.
"""

import asyncio
import json
import argparse
from pathlib import Path
from typing import Optional

from src.config.settings import EngineSettings
from src.orchestrator import run_engine
from src.utils.logger import get_logger

logger = get_logger("main")


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Autonomous Trend Intelligence Engine - Detect emerging tech trends",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                          # Run with defaults
  python main.py --verbose                # Enable verbose output
  python main.py --output-dir ./results   # Custom output directory
  python main.py --timeout 300            # 5-minute timeout
        """
    )
    
    parser.add_argument(
        "--verbose",
        action="store_true",
        default=EngineSettings.VERBOSE,
        help="Enable verbose logging"
    )
    
    parser.add_argument(
        "--output-dir",
        type=str,
        default=str(EngineSettings.OUTPUT_DIR),
        help=f"Output directory (default: {EngineSettings.OUTPUT_DIR})"
    )
    
    parser.add_argument(
        "--timeout",
        type=int,
        default=300,
        help="Execution timeout in seconds (default: 300)"
    )
    
    parser.add_argument(
        "--spike-threshold",
        type=float,
        default=EngineSettings.SPIKE_THRESHOLD,
        help=f"Spike detection threshold (default: {EngineSettings.SPIKE_THRESHOLD})"
    )
    
    parser.add_argument(
        "--min-confidence",
        type=float,
        default=EngineSettings.MIN_CONFIDENCE,
        help=f"Minimum confidence score (default: {EngineSettings.MIN_CONFIDENCE})"
    )
    
    return parser.parse_args()


def save_results(results: dict, output_dir: Path) -> None:
    """Save execution results to disk."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save main results
    results_file = output_dir / "results.json"
    with open(results_file, "w") as f:
        json.dump(results, f, indent=2, default=str)
    logger.info(f"Results saved to {results_file}")
    
    # Save individual artifacts
    artifacts = results.get("artifacts", [])
    for i, artifact in enumerate(artifacts):
        artifact_dir = output_dir / f"artifact_{i:03d}_{artifact.get('trend_id', 'unknown')}"
        artifact_dir.mkdir(parents=True, exist_ok=True)
        
        # Save model card
        model_card_file = artifact_dir / "model_card.md"
        with open(model_card_file, "w") as f:
            f.write(artifact.get("model_card", "# Model Card\n\nNo content available."))
        
        # Save boilerplate code
        boilerplate_file = artifact_dir / "boilerplate_setup.py"
        with open(boilerplate_file, "w") as f:
            f.write(artifact.get("boilerplate_code", "# Boilerplate\n\nNo content available."))
        
        # Save trade-off analysis
        tradeoff_file = artifact_dir / "trade_off_analysis.md"
        with open(tradeoff_file, "w") as f:
            f.write(artifact.get("trade_off_analysis", "# Trade-off Analysis\n\nNo content available."))
    
    logger.info(f"Saved {len(artifacts)} artifact bundles to {output_dir}")


async def main() -> int:
    """Main async entry point."""
    args = parse_args()
    
    # Update settings from arguments
    EngineSettings.VERBOSE = args.verbose
    EngineSettings.SPIKE_THRESHOLD = args.spike_threshold
    EngineSettings.MIN_CONFIDENCE = args.min_confidence
    output_dir = Path(args.output_dir)
    
    logger.info("=== Trend Intelligence Engine ===")
    logger.info(f"Configuration: {EngineSettings.to_dict()}")
    
    try:
        # Run engine with timeout
        results = await asyncio.wait_for(run_engine(), timeout=args.timeout)
        
        # Save results
        save_results(results, output_dir)
        
        # Print summary
        logger.info("=== Execution Summary ===")
        logger.info(f"Status: {results.get('status', 'unknown')}")
        logger.info(f"Trends Discovered: {results.get('trends_discovered', 0)}")
        logger.info(f"Profiles Generated: {results.get('profiles_generated', 0)}")
        logger.info(f"Artifacts Created: {results.get('artifacts_created', 0)}")
        
        telemetry = results.get("telemetry", {})
        if telemetry.get("duration_seconds"):
            logger.info(f"Execution Time: {telemetry['duration_seconds']:.2f}s")
        
        return 0 if results.get("status") == "success" else 1
    
    except asyncio.TimeoutError:
        logger.error(f"Execution timeout after {args.timeout} seconds")
        return 1
    except Exception as e:
        logger.error("Execution failed", exception=e)
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
