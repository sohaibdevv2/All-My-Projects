"""
Tool implementations for trend scouting and data collection.
"""

import httpx
import json
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from urllib.parse import urljoin
import asyncio

from src.config.settings import EngineSettings, RetryPolicy
from src.utils.logger import get_logger

logger = get_logger(__name__)
retry_policy = RetryPolicy()


class DataScraperBase:
    """Base class for data scrapers with retry logic."""
    
    def __init__(self, timeout: int = EngineSettings.REQUEST_TIMEOUT):
        self.timeout = timeout
        self.client = httpx.AsyncClient(timeout=timeout)
    
    async def fetch_with_retry(
        self,
        url: str,
        headers: Optional[Dict[str, str]] = None,
        method: str = "GET"
    ) -> Dict[str, Any]:
        """Fetch URL with exponential backoff retry."""
        for attempt in range(retry_policy.max_retries):
            try:
                logger.debug(f"Fetching {url} (attempt {attempt + 1})")
                response = await self.client.request(method, url, headers=headers)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                if not retry_policy.should_retry(attempt, e):
                    logger.error(f"Failed to fetch {url} after {attempt + 1} attempts", exception=e)
                    raise
                delay = retry_policy.get_delay(attempt)
                logger.warning(f"Retry {url} in {delay}s", error=str(e))
                await asyncio.sleep(delay)
        
        raise RuntimeError(f"Failed to fetch {url} after {retry_policy.max_retries} attempts")
    
    async def close(self) -> None:
        """Close HTTP client."""
        await self.client.aclose()


class HuggingFaceScraper(DataScraperBase):
    """Scrape trending models and papers from Hugging Face Hub."""
    
    async def fetch_trending_models(
        self,
        limit: int = 50,
        timeframe_days: int = 7
    ) -> Dict[str, Any]:
        """Fetch trending models from Hugging Face."""
        try:
            url = urljoin(EngineSettings.HUGGINGFACE_API_URL, "/models")
            headers = {}
            if EngineSettings.HUGGINGFACE_TOKEN:
                headers["Authorization"] = f"Bearer {EngineSettings.HUGGINGFACE_TOKEN}"
            
            data = await self.fetch_with_retry(url, headers=headers)
            
            # Mock response structure for now
            if isinstance(data, list):
                items = data[:limit]
            else:
                items = data.get("models", [])[:limit]
            
            logger.info(f"Fetched {len(items)} trending models from HuggingFace")
            return {
                "status": "success",
                "items": items,
                "metadata": {
                    "total_items": len(items),
                    "timeframe_days": timeframe_days,
                    "request_timestamp": datetime.utcnow().isoformat()
                }
            }
        except Exception as e:
            logger.error("Failed to fetch HuggingFace models", exception=e)
            return {
                "status": "error",
                "error": str(e),
                "items": []
            }


class GitHubScraper(DataScraperBase):
    """Scrape trending repositories from GitHub."""
    
    async def fetch_trending_repos(
        self,
        languages: Optional[List[str]] = None,
        since: str = "weekly",
        limit: int = 100
    ) -> Dict[str, Any]:
        """Fetch trending repositories from GitHub."""
        try:
            url = urljoin(EngineSettings.GITHUB_API_URL, "/search/repositories")
            
            # Build search query
            query_parts = ["sort:stars", f"created:>{(datetime.utcnow() - timedelta(days=7)).date()}"]
            if languages:
                lang_query = " OR ".join([f"language:{lang}" for lang in languages])
                query_parts.append(f"({lang_query})")
            
            params = {
                "q": " ".join(query_parts),
                "per_page": min(limit, 100),
                "sort": "stars",
                "order": "desc"
            }
            
            headers = {}
            if EngineSettings.GITHUB_TOKEN:
                headers["Authorization"] = f"token {EngineSettings.GITHUB_TOKEN}"
            
            response = await self.client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            repos = data.get("items", [])
            logger.info(f"Fetched {len(repos)} trending repositories from GitHub")
            
            return {
                "status": "success",
                "repositories": repos,
                "metadata": {
                    "total_count": len(repos),
                    "request_timestamp": datetime.utcnow().isoformat(),
                    "language_filter": str(languages)
                }
            }
        except Exception as e:
            logger.error("Failed to fetch GitHub repositories", exception=e)
            return {
                "status": "error",
                "error": str(e),
                "repositories": []
            }


class CommunityScraper(DataScraperBase):
    """Scrape trending topics from developer communities."""
    
    async def fetch_from_hackernews(
        self,
        limit: int = 30
    ) -> List[Dict[str, Any]]:
        """Fetch trending stories from Hacker News."""
        try:
            url = "https://hacker-news.firebaseio.com/v0/topstories.json"
            story_ids = await self.fetch_with_retry(url)
            story_ids = story_ids[:limit]
            
            stories = []
            for story_id in story_ids:
                try:
                    story_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
                    story = await self.fetch_with_retry(story_url)
                    stories.append(story)
                except Exception as e:
                    logger.warning(f"Failed to fetch HN story {story_id}", error=str(e))
                    continue
            
            logger.info(f"Fetched {len(stories)} stories from Hacker News")
            return stories
        except Exception as e:
            logger.error("Failed to fetch from Hacker News", exception=e)
            return []
    
    async def fetch_from_communities(
        self,
        sources: List[str] = ["hackernews"],
        limit: int = 30
    ) -> Dict[str, Any]:
        """Fetch trending discussions from communities."""
        try:
            discussions = []
            
            if "hackernews" in sources:
                hn_stories = await self.fetch_from_hackernews(limit)
                discussions.extend([{
                    "id": str(s.get("id")),
                    "title": s.get("title", ""),
                    "source": "hackernews",
                    "url": s.get("url", ""),
                    "engagement": {
                        "votes": s.get("score", 0),
                        "comments": s.get("descendants", 0)
                    }
                } for s in hn_stories])
            
            logger.info(f"Fetched {len(discussions)} discussions from communities")
            return {
                "status": "success" if discussions else "partial",
                "discussions": discussions,
                "metadata": {
                    "total_count": len(discussions),
                    "sources_queried": sources,
                    "request_timestamp": datetime.utcnow().isoformat()
                }
            }
        except Exception as e:
            logger.error("Failed to fetch community data", exception=e)
            return {
                "status": "error",
                "error": str(e),
                "discussions": []
            }
