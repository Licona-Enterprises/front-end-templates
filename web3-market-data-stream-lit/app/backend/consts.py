"""
Constants and configuration values for the application.
Edit this file to customize your experience.
"""

# Default Ethereum addresses to track for portfolio balances
# TODO delete for production
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

BASE_URLS = {
    "polygon": "https://api.polygonscan.com/api",
    "arbitrum": "https://api.arbiscan.io/api",
    "optimism": "https://api-optimistic.etherscan.io/api",
    "base": "https://api.basescan.org/api"
}

# TODO always update wallets 
PORTFOLIOS = {
    "FDA_PORTOLFIO_3" : {
        "STRATEGY_WALLETS":{
            "FDA_Lend_Polygon_1": {
                "address": "0xb90839A51511042c69553AC4e60aa184449f5bc7",
                "active_protocols": ["aave"],
                "active_networks": ["polygon"]
            },
            "FDA_SpecSpec_Arb": {
                "address": "0x88F199ea919C6ac124d3B2407f9E2b4B700fa47D",
                "active_protocols": ["uniswap"],
                "active_networks": ["arbitrum"],
                "uniswapv3_positions_nft_ids": ["ARBITRUM_UNISWAP_V3_POSITIONS_NFT_V1"]
            }
        }
    }
}

TOKENS = {
    "AAVE_ATOKEN_POLYGON_USDC": {
        "address": "0xA4D94019934D8333Ef880ABFFbF2FDd611C762BD",
        "decimals": 6
    },
    "AAVE_ATOKEN_POLYGON_USDT": {
        "address": "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
        "decimals": 6
    },
    "AAVE_ATOKEN_POLYGON_DAI": {
        "address": "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
        "decimals": 18
    },
    "AAVE_ATOKEN_ARBITRUM_USDC": {
        "address": "0x724dc807b04555b71ed48a6896b6F41593b8C637",
        "decimals": 6
    },
    "ARBITRUM_WETH": {
        "address": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        "decimals": 18
    },
    "ARBITRUM_WBTC": {
        "address": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        "decimals": 8
    },
}


UNISWAP_V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"

UNISWAP_V3_POSITIONS_NFT_IDS = {
    "ARBITRUM_UNISWAP_V3_POSITIONS_NFT_V1": {
        "address": "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
    }
}
