from fastapi import FastAPI, Query
import os
from dotenv import load_dotenv
from typing import Optional, List
from block_explorers import BlockExplorerService
from consts import DEFAULT_ASSETS, METRIC_FREQUENCIES
from coinmetrics import CoinMetricsService

load_dotenv()

app = FastAPI()

# Initialize services
block_explorer_service = BlockExplorerService()
coinmetrics_service = CoinMetricsService()

@app.get("/api/market-data")
async def get_market_data(
    metrics: List[str] = Query(default=["ReferenceRate"]),
    assets: List[str] = Query(default=DEFAULT_ASSETS)
):
    # Added extra validation to ensure we have assets
    if not assets:
        return {"error": "No assets specified"}
    
    # Fetch data for requested metrics (or default to ReferenceRate)
    data = await coinmetrics_service.fetch_market_data(
        metrics=metrics, 
        metric_frequencies=METRIC_FREQUENCIES,
        assets=assets
    )
    return data

# New endpoints for block explorer API
@app.get("/api/eth-balances")
async def get_eth_balances(
    chain: str = Query(default="arbitrum"),
    addresses: List[str] = Query()
):
    """
    Get ETH balances for multiple addresses.
    """
    if not addresses:
        return {"error": "No addresses specified"}
    
    return await block_explorer_service.get_eth_balances_multi(chain, addresses)

@app.get("/api/eth-balance/{address}")
async def get_eth_balance(
    address: str,
    chain: str = Query(default="arbitrum")
):
    """
    Get ETH balance for a single address.
    """
    return await block_explorer_service.get_eth_balance(chain, address)
