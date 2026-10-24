"""
Structured logging infrastructure for the engine.
"""

import logging
import json
from typing import Any, Dict, Optional
from datetime import datetime

from src.config.settings import EngineSettings


class StructuredLogger:
    """Structured logging with JSON output support."""
    
    def __init__(self, name: str, agent_id: Optional[str] = None):
        self.name = name
        self.agent_id = agent_id
        self.logger = logging.getLogger(name)
        self._setup_handlers()
    
    def _setup_handlers(self) -> None:
        """Setup file and console handlers."""
        if self.logger.hasHandlers():
            return
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO if EngineSettings.VERBOSE else logging.WARNING)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)
        
        # File handler
        if self.agent_id:
            log_file = EngineSettings.LOG_DIR / f"agent_{self.agent_id}.log"
        else:
            log_file = EngineSettings.LOG_DIR / "engine.log"
        
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)
        
        self.logger.setLevel(logging.DEBUG)
    
    def debug(self, message: str, **kwargs) -> None:
        """Log debug message with optional structured data."""
        if kwargs:
            self.logger.debug(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.debug(message)
    
    def info(self, message: str, **kwargs) -> None:
        """Log info message with optional structured data."""
        if kwargs:
            self.logger.info(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.info(message)
    
    def warning(self, message: str, **kwargs) -> None:
        """Log warning message with optional structured data."""
        if kwargs:
            self.logger.warning(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.warning(message)
    
    def error(self, message: str, exception: Optional[Exception] = None, **kwargs) -> None:
        """Log error message with optional exception and structured data."""
        if exception:
            self.logger.error(f"{message} | Exception: {str(exception)}", exc_info=True)
        elif kwargs:
            self.logger.error(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.error(message)
    
    def critical(self, message: str, **kwargs) -> None:
        """Log critical message with optional structured data."""
        if kwargs:
            self.logger.critical(f"{message} | {json.dumps(kwargs)}")
        else:
            self.logger.critical(message)


def get_logger(name: str, agent_id: Optional[str] = None) -> StructuredLogger:
    """Factory function to get logger instance."""
    return StructuredLogger(name, agent_id)
