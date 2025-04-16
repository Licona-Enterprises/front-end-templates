import json
import math
from web3 import Web3
from decimal import Decimal

# Replace with your Arbitrum (or other network) RPC endpoint
ARBITRUM_RPC = "https://arb-mainnet.g.alchemy.com/v2/DaboUGjPdJKw2UY-R1TUCrZhV-q30azQ"
web3 = Web3(Web3.HTTPProvider(ARBITRUM_RPC))

# NonfungiblePositionManager contract address
UNISWAP_V3_MANAGER_ADDRESS = Web3.to_checksum_address("0xC36442b4a4522E871399CD717aBDD847Ab11FE88")

# Uniswap v3 Pool ABI (minimal for slot0)
UNISWAP_V3_POOL_ABI = [
    {
        "inputs": [],
        "name": "slot0",
        "outputs": [
            {"internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160"},
            {"internalType": "int24", "name": "tick", "type": "int24"},
            {"internalType": "uint16", "name": "observationIndex", "type": "uint16"},
            {"internalType": "uint16", "name": "observationCardinality", "type": "uint16"},
            {"internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16"},
            {"internalType": "uint8", "name": "feeProtocol", "type": "uint8"},
            {"internalType": "bool", "name": "unlocked", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# Uniswap v3 Factory ABI (minimal for getPool)
UNISWAP_V3_FACTORY_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "tokenA", "type": "address"},
            {"internalType": "address", "name": "tokenB", "type": "address"},
            {"internalType": "uint24", "name": "fee", "type": "uint24"}
        ],
        "name": "getPool",
        "outputs": [{"internalType": "address", "name": "pool", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
]

# ERC20 ABI (minimal for name, symbol, decimals)
ERC20_ABI = [
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    }
]

# Uniswap V3 Position Manager ABI (relevant subset)
POSITION_MANAGER_ABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "positions",
        "outputs": [
            {"internalType": "uint96", "name": "nonce", "type": "uint96"},
            {"internalType": "address", "name": "operator", "type": "address"},
            {"internalType": "address", "name": "token0", "type": "address"},
            {"internalType": "address", "name": "token1", "type": "address"},
            {"internalType": "uint24", "name": "fee", "type": "uint24"},
            {"internalType": "int24", "name": "tickLower", "type": "int24"},
            {"internalType": "int24", "name": "tickUpper", "type": "int24"},
            {"internalType": "uint128", "name": "liquidity", "type": "uint128"},
            {"internalType": "uint256", "name": "feeGrowthInside0LastX128", "type": "uint256"},
            {"internalType": "uint256", "name": "feeGrowthInside1LastX128", "type": "uint256"},
            {"internalType": "uint128", "name": "tokensOwed0", "type": "uint128"},
            {"internalType": "uint128", "name": "tokensOwed1", "type": "uint128"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# Minimal ABI for owner token balance and token ID lookup
ERC721_ABI = [
    {
        "constant": True,
        "inputs": [{"name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [
            {"name": "owner", "type": "address"},
            {"name": "index", "type": "uint256"}
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [{"name": "tokenId", "type": "uint256"}],
        "type": "function",
    }
]

# Uniswap V3 Factory address
UNISWAP_V3_FACTORY_ADDRESS = Web3.to_checksum_address("0x1F98431c8aD98523631AE4a59f267346ea31F984")

def get_token_info(token_address):
    """Get token name, symbol and decimals"""
    token_contract = web3.eth.contract(address=token_address, abi=ERC20_ABI)
    
    try:
        name = token_contract.functions.name().call()
        symbol = token_contract.functions.symbol().call()
        decimals = token_contract.functions.decimals().call()
        return {"name": name, "symbol": symbol, "decimals": decimals}
    except Exception as e:
        print(f"Error fetching token info for {token_address}: {e}")
        return {"name": "Unknown", "symbol": "Unknown", "decimals": 18}

def get_sqrt_ratio_at_tick(tick):
    """Calculate sqrtPriceX96 from tick"""
    return int(1.0001 ** (tick / 2) * 2 ** 96)

def get_token_amounts_from_liquidity(liquidity, tick_lower, tick_upper, current_sqrt_price_x96):
    """Calculate token amounts from liquidity, tick range, and current price"""
    liquidity = int(liquidity)
    sqrt_ratio_a_x96 = get_sqrt_ratio_at_tick(tick_lower)
    sqrt_ratio_b_x96 = get_sqrt_ratio_at_tick(tick_upper)
    
    # Ensure sqrt_ratio_a_x96 <= sqrt_ratio_b_x96
    if sqrt_ratio_a_x96 > sqrt_ratio_b_x96:
        sqrt_ratio_a_x96, sqrt_ratio_b_x96 = sqrt_ratio_b_x96, sqrt_ratio_a_x96
    
    current_sqrt_price_x96 = int(current_sqrt_price_x96)
    
    if current_sqrt_price_x96 <= sqrt_ratio_a_x96:
        # Only token0
        amount0 = (liquidity * (sqrt_ratio_b_x96 - sqrt_ratio_a_x96)) // (sqrt_ratio_a_x96 * sqrt_ratio_b_x96 // (2**96))
        amount1 = 0
    elif current_sqrt_price_x96 >= sqrt_ratio_b_x96:
        # Only token1
        amount0 = 0
        amount1 = (liquidity * (sqrt_ratio_b_x96 - sqrt_ratio_a_x96)) // (2**96)
    else:
        # Both tokens
        amount0 = (liquidity * (sqrt_ratio_b_x96 - current_sqrt_price_x96)) // (current_sqrt_price_x96 * sqrt_ratio_b_x96 // (2**96))
        amount1 = (liquidity * (current_sqrt_price_x96 - sqrt_ratio_a_x96)) // (2**96)
    
    return amount0, amount1

def calculate_position_details(position_manager, token_id):
    """Calculate full details of a Uniswap V3 position"""
    try:
        # Get position data
        position = position_manager.functions.positions(token_id).call()
        
        token0_address = position[2]
        token1_address = position[3]
        fee = position[4]
        tick_lower = position[5]
        tick_upper = position[6]
        liquidity = position[7]
        tokensOwed0 = position[10]  # Uncollected fees token0
        tokensOwed1 = position[11]  # Uncollected fees token1
        
        # Get token info
        token0_info = get_token_info(token0_address)
        token1_info = get_token_info(token1_address)
        
        # Get pool address from factory
        factory = web3.eth.contract(address=UNISWAP_V3_FACTORY_ADDRESS, abi=UNISWAP_V3_FACTORY_ABI)
        pool_address = factory.functions.getPool(token0_address, token1_address, fee).call()
        
        if pool_address == '0x0000000000000000000000000000000000000000':
            return {
                "error": f"Pool not found for {token0_info['symbol']}/{token1_info['symbol']} with fee {fee/10000}%"
            }
        
        # Get current price from pool
        pool_contract = web3.eth.contract(address=pool_address, abi=UNISWAP_V3_POOL_ABI)
        slot0 = pool_contract.functions.slot0().call()
        current_sqrt_price_x96 = slot0[0]
        current_tick = slot0[1]
        
        # Calculate token amounts
        amount0, amount1 = get_token_amounts_from_liquidity(liquidity, tick_lower, tick_upper, current_sqrt_price_x96)
        
        # Convert to human-readable format with proper decimals
        amount0_decimal = Decimal(amount0) / Decimal(10 ** token0_info['decimals'])
        amount1_decimal = Decimal(amount1) / Decimal(10 ** token1_info['decimals'])
        
        # Convert uncollected fees to proper decimals
        fees0_decimal = Decimal(tokensOwed0) / Decimal(10 ** token0_info['decimals'])
        fees1_decimal = Decimal(tokensOwed1) / Decimal(10 ** token1_info['decimals'])
        
        # Calculate price range
        price_lower = (1.0001 ** tick_lower) 
        price_upper = (1.0001 ** tick_upper)
        current_price = (1.0001 ** current_tick)
        
        # If token0 is the base token (like WETH), invert the prices to get the quote price
        # This makes it match what you typically see on interfaces
        price_is_inverted = False
        if token0_info['symbol'] in ["WETH", "ETH", "WBTC", "BTC"]:
            price_lower = 1 / price_upper
            price_upper = 1 / price_lower
            current_price = 1 / current_price
            price_is_inverted = True
        
        # Format the price range as seen on block explorers
        price_range_text = f"{price_lower:.6f}<>{price_upper:.6f}"
        
        return {
            "token_id": token_id,
            "token0": {
                "address": token0_address,
                "symbol": token0_info['symbol'],
                "name": token0_info['name'],
                "decimals": token0_info['decimals'],
                "amount": str(amount0_decimal),
                "uncollected_fees": str(fees0_decimal)
            },
            "token1": {
                "address": token1_address,
                "symbol": token1_info['symbol'],
                "name": token1_info['name'],
                "decimals": token1_info['decimals'],
                "amount": str(amount1_decimal),
                "uncollected_fees": str(fees1_decimal)
            },
            "pool": {
                "address": pool_address,
                "fee": fee / 10000,  # Convert to percentage
                "current_tick": current_tick,
                "current_sqrt_price_x96": current_sqrt_price_x96,
                "current_price": current_price,
            },
            "position": {
                "liquidity": liquidity,
                "tick_lower": tick_lower,
                "tick_upper": tick_upper,
                "price_lower": price_lower if not price_is_inverted else 1/price_lower,
                "price_upper": price_upper if not price_is_inverted else 1/price_upper,
                "price_range_text": price_range_text,
                "in_range": tick_lower <= current_tick <= tick_upper,
                "price_is_inverted": price_is_inverted
            }
        }
    
    except Exception as e:
        return {"error": f"Error calculating position details for token ID {token_id}: {str(e)}"}

def main():
    # Create contract instances
    position_manager = web3.eth.contract(address=UNISWAP_V3_MANAGER_ADDRESS, abi=POSITION_MANAGER_ABI)
    erc721_contract = web3.eth.contract(address=UNISWAP_V3_MANAGER_ADDRESS, abi=ERC721_ABI)
    
    # Use fixed wallet address for testing
    owner_address = Web3.to_checksum_address("0x88F199ea919C6ac124d3B2407f9E2b4B700fa47D")
    
    print(f"\nFetching Uniswap V3 positions for {owner_address}...")
    
    # Get token IDs owned by the address
    try:
        balance = erc721_contract.functions.balanceOf(owner_address).call()
        
        if balance == 0:
            print(f"No Uniswap V3 positions found for {owner_address}")
            return
        
        print(f"Found {balance} Uniswap V3 positions\n")
        
        token_ids = []
        for i in range(balance):
            token_id = erc721_contract.functions.tokenOfOwnerByIndex(owner_address, i).call()
            token_ids.append(token_id)
        
        positions_data = []
        
        # Process each position
        for token_id in token_ids:
            print(f"Processing position #{token_id}...")
            position_details = calculate_position_details(position_manager, token_id)
            positions_data.append(position_details)
            
            # Print a nice summary for each position
            if "error" not in position_details:
                p = position_details
                print(f"\n✅ Position #{p['token_id']}")
                print(f"   Pool: {p['token0']['symbol']}/{p['token1']['symbol']} {p['pool']['fee']}%")
                print(f"   Current price: {p['pool']['current_price']:.8f}")
                print(f"   Price range: {p['position']['price_range_text']}")
                print(f"   Status: {'🟢 In Range' if p['position']['in_range'] else '🔴 Out of Range'}")
                print(f"   Token quantities:")
                print(f"     • {p['token0']['amount']} {p['token0']['symbol']}")
                print(f"     • {p['token1']['amount']} {p['token1']['symbol']}")
                print(f"   Uncollected fees:")
                print(f"     • {p['token0']['uncollected_fees']} {p['token0']['symbol']}")
                print(f"     • {p['token1']['uncollected_fees']} {p['token1']['symbol']}")
                print("")
            else:
                print(f"   ❌ Error: {position_details['error']}")
        
        # Save all details to a JSON file
        with open("uniswap_positions.json", "w") as f:
            json.dump(positions_data, f, indent=2)
        
        print(f"\nSaved detailed position data to uniswap_positions.json")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main() 