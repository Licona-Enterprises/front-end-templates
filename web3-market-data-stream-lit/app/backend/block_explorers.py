# import requests
# import os
# from dotenv import load_dotenv
# # from consts import PORTFOLIOS, TOKENS, UNISWAP_V3_POSITIONS_NFT_IDS, BASE_URLS
# from consts import PORTFOLIOS, TOKENS, UNISWAP_V3_POSITIONS_NFT_IDS, BASE_URLS

# class AaveUniswapScanner:
#     def __init__(self):
#         load_dotenv()
#         self.api_keys = {
#             "polygon": os.getenv("POLYGONSCAN_API_KEY"),
#             "arbitrum": os.getenv("ARBISCAN_API_KEY"),
#             "optimism": os.getenv("OPTIMISM_API_KEY"),
#             "base": os.getenv("BASESCAN_API_KEY"),
#         }

#     def get_erc20_balance(self, chain: str, wallet: str, token_address: str, decimals: int) -> float:
#         url = BASE_URLS[chain]
#         params = {
#             "module": "account",
#             "action": "tokenbalance",
#             "contractaddress": token_address,
#             "address": wallet,
#             "tag": "latest",
#             "apikey": self.api_keys[chain]
#         }
#         try:
#             response = requests.get(url, params=params)
#             response.raise_for_status()  # Raise exception for 4XX/5XX status codes
#             data = response.json()
#             if data.get("status") == "1":
#                 raw_balance = int(data.get("result", "0"))
#                 return raw_balance / (10 ** decimals)
#             else:
#                 print(f"Error fetching balance for {wallet} on {chain}: {data.get('message', 'Unknown error')}")
#                 return 0.0
#         except Exception as e:
#             print(f"Exception when fetching balance for {wallet} on {chain}: {str(e)}")
#             return 0.0

#     def get_uniswap_positions(self, chain: str, wallet: str, nft_contract_address: str) -> list:
#         url = BASE_URLS[chain]
#         params = {
#             "module": "account",
#             "action": "tokennfttx",
#             "contractaddress": nft_contract_address,
#             "address": wallet,
#             "page": 1,
#             "offset": 100,
#             "sort": "asc",
#             "apikey": self.api_keys[chain]
#         }
#         try:
#             response = requests.get(url, params=params)
#             response.raise_for_status()  # Raise exception for 4XX/5XX status codes
#             data = response.json()
#             if data.get("status") == "1":
#                 return [
#                     {
#                         "tokenID": pos["tokenID"],
#                         "from": pos["from"],
#                         "to": pos["to"],
#                         "timeStamp": pos["timeStamp"]
#                     }
#                     for pos in data.get("result", [])
#                 ]
#             else:
#                 print(f"Error fetching Uniswap positions for {wallet} on {chain}: {data.get('message', 'Unknown error')}")
#                 return []
#         except Exception as e:
#             print(f"Exception when fetching Uniswap positions for {wallet} on {chain}: {str(e)}")
#             return []

#     def fetch_all_balances(self):
#         results = {}
#         for portfolio_name, portfolio in PORTFOLIOS.items():
#             primary_wallet = portfolio.get(portfolio_name)
#             if primary_wallet:  # Only process if primary wallet exists and is valid
#                 for token_name, token_data in TOKENS.items():
#                     chain_name = token_name.split('_')[-2].lower()
#                     if chain_name in self.api_keys:  # Check if we have an API key for this chain
#                         balance = self.get_erc20_balance(chain_name, primary_wallet, token_data["address"], token_data["decimals"])
#                         if balance > 0:
#                             results[(chain_name, portfolio_name, primary_wallet, token_name)] = balance

#             for strategy_name, strategy_info in portfolio.get("STRATEGY_WALLETS", {}).items():
#                 wallet = strategy_info["address"]
#                 active_protocols = strategy_info.get("active_protocols", [])
#                 if "aave" in active_protocols:
#                     for token_name, token_data in TOKENS.items():
#                         chain_name = token_name.split('_')[-2].lower()
#                         if chain_name in self.api_keys:  # Check if we have an API key for this chain
#                             balance = self.get_erc20_balance(chain_name, wallet, token_data["address"], token_data["decimals"])
#                             if balance > 0:
#                                 results[(chain_name, strategy_name, wallet, token_name)] = balance

#         return results

#     def fetch_all_uniswap_positions(self):
#         results = {}
#         for portfolio_name, portfolio in PORTFOLIOS.items():
#             primary_wallet = portfolio.get(portfolio_name)
#             if primary_wallet:  # Only process if primary wallet exists and is valid
#                 for contract_key, contract in UNISWAP_V3_POSITIONS_NFT_IDS.items():
#                     chain_name = contract_key.split('_')[0].lower()
#                     if chain_name in self.api_keys:  # Check if we have an API key for this chain
#                         positions = self.get_uniswap_positions(chain_name, primary_wallet, contract["address"])
#                         if positions:
#                             results[(chain_name, portfolio_name, primary_wallet)] = positions

#             for strategy_name, strategy_info in portfolio.get("STRATEGY_WALLETS", {}).items():
#                 wallet = strategy_info["address"]
#                 active_protocols = strategy_info.get("active_protocols", [])
#                 if "uniswap" in active_protocols:
#                     for contract_key, contract in UNISWAP_V3_POSITIONS_NFT_IDS.items():
#                         chain_name = contract_key.split('_')[0].lower()
#                         if chain_name in self.api_keys:  # Check if we have an API key for this chain
#                             positions = self.get_uniswap_positions(chain_name, wallet, contract["address"])
#                             if positions:
#                                 results[(chain_name, strategy_name, wallet)] = positions

#         return results
