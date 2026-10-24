"""
Tool implementations for technical evaluation and metric computation.
"""

import statistics
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from src.utils.logger import get_logger
from src.models.domain import SpikMetrics

logger = get_logger(__name__)


class MetricsComputer:
    """Compute spike metrics and trend signals."""
    
    @staticmethod
    def compute_star_velocity(
        current_data: Dict[str, int],
        historical_data: List[Dict[str, Any]],
        window_days: int = 7
    ) -> float:
        """Compute stars per day velocity."""
        if not historical_data or len(historical_data) < window_days:
            return 0.0
        
        recent = historical_data[-window_days:]
        star_diffs = [recent[i].get("stars", 0) - recent[i-1].get("stars", 0)
                      for i in range(1, len(recent))]
        return sum(star_diffs) / len(star_diffs) if star_diffs else 0.0
    
    @staticmethod
    def compute_fork_acceleration(
        current_data: Dict[str, int],
        historical_data: List[Dict[str, Any]],
        window_days: int = 7
    ) -> float:
        """Compute fork acceleration ratio."""
        if not historical_data or len(historical_data) < window_days * 2:
            return 1.0
        
        current_period = historical_data[-window_days:]
        previous_period = historical_data[-window_days*2:-window_days]
        
        current_rate = sum([current_period[i].get("forks", 0) - current_period[i-1].get("forks", 0)
                           for i in range(1, len(current_period))]) / max(1, len(current_period))
        
        previous_rate = sum([previous_period[i].get("forks", 0) - previous_period[i-1].get("forks", 0)
                            for i in range(1, len(previous_period))]) / max(1, len(previous_period))
        
        return current_rate / max(0.1, previous_rate)  # Avoid division by zero
    
    @staticmethod
    def compute_sigma(
        current_value: float,
        historical_values: List[float]
    ) -> float:
        """Compute standard deviations from mean."""
        if len(historical_values) < 2:
            return 0.0
        
        mean = statistics.mean(historical_values)
        stdev = statistics.stdev(historical_values)
        
        if stdev == 0:
            return 0.0
        
        return (current_value - mean) / stdev
    
    @classmethod
    def compute_all_metrics(
        cls,
        current_data: Dict[str, int],
        historical_data: List[Dict[str, Any]],
        baseline_window: int = 30,
        significance_threshold: float = 1.5
    ) -> Dict[str, Any]:
        """Compute all spike metrics."""
        try:
            # Extract historical values for baseline
            stars_history = [d.get("stars", 0) for d in historical_data[-baseline_window:]]
            forks_history = [d.get("forks", 0) for d in historical_data[-baseline_window:]]
            commits_history = [d.get("commits", 0) for d in historical_data[-baseline_window:]]
            
            # Compute velocities
            star_velocity = cls.compute_star_velocity(current_data, historical_data)
            fork_acceleration = cls.compute_fork_acceleration(current_data, historical_data)
            
            # Compute baseline values
            baseline_star_velocity = statistics.mean(
                [cls.compute_star_velocity(current_data, historical_data[max(0,i-7):i+1])
                 for i in range(7, len(historical_data))]
            ) if len(historical_data) > 14 else 0
            
            # Compute sigma
            star_sigma = cls.compute_sigma(star_velocity, [baseline_star_velocity] * 10 + [star_velocity])
            fork_sigma = cls.compute_sigma(fork_acceleration, [1.0] * 10 + [fork_acceleration])
            
            # Determine spikes
            star_spike = star_sigma > significance_threshold
            fork_spike = fork_sigma > significance_threshold
            
            # Compute overall engagement score
            engagement_components = [
                min(1.0, star_velocity / 100) if star_velocity > 0 else 0,
                min(1.0, fork_acceleration / 3.0) if fork_acceleration > 1.0 else 0,
                1.0 if star_spike or fork_spike else 0.3
            ]
            engagement_score = sum(engagement_components) / len(engagement_components)
            
            return {
                "metrics": {
                    "star_velocity": {
                        "current_value": star_velocity,
                        "baseline_value": baseline_star_velocity,
                        "sigma": star_sigma,
                        "is_spike": star_spike,
                        "confidence": min(1.0, abs(star_sigma) / 3.0)
                    },
                    "fork_acceleration": {
                        "current_value": fork_acceleration,
                        "acceleration_ratio": fork_acceleration,
                        "is_spike": fork_spike,
                        "confidence": min(1.0, abs(fork_sigma) / 3.0)
                    },
                    "commit_velocity": {
                        "current_value": current_data.get("commits", 0),
                        "is_spike": current_data.get("commits", 0) > 100
                    }
                },
                "summary": {
                    "overall_spike_score": engagement_score,
                    "spike_count": sum([star_spike, fork_spike]),
                    "trend_classification": "high" if engagement_score > 0.7 else "medium" if engagement_score > 0.4 else "low",
                    "recommendation": "flag_trend" if engagement_score > 0.6 else "monitor" if engagement_score > 0.3 else "ignore"
                },
                "diagnostic": {
                    "data_points_used": len(historical_data),
                    "baseline_std_dev": statistics.stdev(stars_history) if len(stars_history) > 1 else 0,
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
        except Exception as e:
            logger.error("Error computing metrics", exception=e)
            return {"error": str(e), "metrics": {}}
