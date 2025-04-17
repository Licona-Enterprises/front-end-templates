import os
import sys
from dotenv import load_dotenv

# Fix import paths by adding the current directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import FastAPI and other modules
from fastapi import FastAPI, Query
from typing import Optional, List, Dict, Any

# Now import local modules
from consts import DEFAULT_ASSETS, METRIC_FREQUENCIES
from coinmetrics import CoinMetricsService
from web3_uniswap_position_calculator import get_uniswap_wallet_addresses, process_positions

load_dotenv()

app = FastAPI()

# Initialize services
# block_explorer_service = BlockExplorerService()
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
    
    pass
    # return await block_explorer_service.get_eth_balances_multi(chain, addresses)

@app.get("/api/eth-balance/{address}")
async def get_eth_balance(
    address: str,
    chain: str = Query(default="arbitrum")
):
    """
    Get ETH balance for a single address.
    """
    pass
    # return await block_explorer_service.get_eth_balance(chain, address)

@app.get("/api/uniswap/positions")
async def get_uniswap_positions(
    portfolio: Optional[str] = Query(default=None),
    wallet_address: Optional[str] = Query(default=None)
):
    """
    Get Uniswap V3 position data for all wallets or filter by portfolio/wallet.
    
    Args:
        portfolio: Optional filter by portfolio name
        wallet_address: Optional filter by specific wallet address
    
    Returns:
        List of Uniswap V3 positions
    """
    try:
        # Get wallet addresses with associated NFT IDs
        wallet_addresses = get_uniswap_wallet_addresses()
        
        if not wallet_addresses:
            return {"error": "No wallets with Uniswap positions found"}
        
        # Filter wallets by portfolio if specified
        if portfolio:
            wallet_addresses = [w for w in wallet_addresses if w["portfolio"] == portfolio]
            
            if not wallet_addresses:
                return {"error": f"No wallets found in portfolio '{portfolio}'"}
        
        # Filter by specific wallet address if provided
        if wallet_address:
            wallet_addresses = [w for w in wallet_addresses if w["address"].lower() == wallet_address.lower()]
            
            if not wallet_addresses:
                return {"error": f"Wallet address '{wallet_address}' not found or has no Uniswap positions"}
        
        # Process all positions across wallets
        all_positions: List[Dict[str, Any]] = []
        for wallet_info in wallet_addresses:
            positions_data = list(process_positions(wallet_info))
            
            # Add wallet info to each position
            for position in positions_data:
                if "error" not in position:
                    position["wallet_address"] = wallet_info["address"]
                    position["portfolio"] = wallet_info["portfolio"]
                    if "strategy" in wallet_info:
                        position["strategy"] = wallet_info["strategy"]
            
            all_positions.extend(positions_data)
        
        # Filter out positions with errors
        valid_positions = [p for p in all_positions if "error" not in p]
        
        return {
            "count": len(valid_positions),
            "positions": valid_positions
        }
        
    except Exception as e:
        return {"error": f"Error retrieving Uniswap positions: {str(e)}"}
