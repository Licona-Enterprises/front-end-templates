import aiohttp
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any
import asyncio

class CoinMetricsService:
    """Service for handling CoinMetrics API calls and data processing."""
    
    def __init__(self):
        self.api_key = os.getenv("COINMETRICS_API_KEY")
        self.api_url = "https://api.coinmetrics.io/v4/timeseries/asset-metrics"
        
    async def fetch_metric_data(self, session: aiohttp.ClientSession, metric: str, frequency: str, assets: List[str]):
        """Fetch data for a specific metric and frequency."""
        today = datetime.now().strftime("%Y-%m-%d")
        yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
        
        # Convert assets to a comma-separated string
        assets_str = ",".join(assets)
        
        # Log what we're requesting
        print(f"Fetching {metric} with frequency {frequency} for assets: {assets_str}")
        
        params = {
            "assets": assets_str,
            "metrics": metric,
            "start_time": yesterday,
            "end_time": today,
            "api_key": self.api_key,
            "frequency": frequency
        }
        
        # Log the full request URL for debugging
        full_url = f"{self.api_url}?{'&'.join([f'{key}={value}' for key, value in params.items() if key != 'api_key'])}"
        print(f"Making API request to: {full_url}")
        
        try:
            async with session.get(self.api_url, params=params) as response:
                if response.status != 200:
                    print(f"Error response for {metric}: {response.status}")
                    return {"error": f"API request failed for {metric} with status {response.status}"}
                
                data = await response.json()
                
                if not data.get("data"):
                    print(f"No data returned for {metric}")
                    return {"error": f"No data available for {metric}"}
                    
                print(f"Got {len(data['data'])} records for {metric}")
                if data["data"]:
                    print(f"Sample record for {metric}: {data['data'][0]}")
                return data
        except Exception as e:
            print(f"Exception fetching {metric}: {e}")
            return {"error": f"Exception fetching {metric}: {e}"}

    async def fetch_market_data(self, metrics: List[str], metric_frequencies: Dict[str, str], assets: List[str]):
        """Fetch market data for multiple metrics with their frequencies."""
        combined_data = []
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            
            # Create a task for each metric with its appropriate frequency
            for metric in metrics:
                if metric in metric_frequencies:
                    frequency = metric_frequencies[metric]
                    tasks.append(self.fetch_metric_data(session, metric, frequency, assets))
            
            # Run all tasks concurrently
            results = await asyncio.gather(*tasks)
            
            # Combine all results
            for result in results:
                if "data" in result and result["data"]:
                    combined_data.extend(result["data"])
            
        return {"data": combined_data} 