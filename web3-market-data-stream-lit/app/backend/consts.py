"""
Constants and configuration values for the application.
Edit this file to customize your experience.
"""

# Default Ethereum addresses to track for portfolio balances
DEFAULT_ETH_ADDRESSES = [
    "0x88197EaCf7545B2686715FbBE3DBb0ec725A8514",  # Replace with your addresses
    "0x262a6f88604aa10b30565b02731441ab55d9e9a3", 
    "0x27a0a9bf2916685ac00c2abc735eb9048a1c3ba4"
]

# Default assets to track in the market data
DEFAULT_ASSETS = ["btc", "eth", "usdc", "usdt", "dai"]

# Metrics configuration
METRIC_FREQUENCIES = {
    "ReferenceRate": "1s",
    "ROI30d": "1d",
    "VtyDayRet30d": "1d",
    "volume_reported_spot_usd_1h": "1h",
    "volatility_realized_usd_rolling_7d": "1d",
    "futures_aggregate_funding_rate_all_margin_8h_period": "1h"
}

# UI settings
AUTO_REFRESH_INTERVAL = 5  # seconds 