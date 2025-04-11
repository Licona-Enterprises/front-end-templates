import os
import aiohttp
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class BlockExplorerService:
    """
    Service for interacting with different blockchain explorer APIs.
    Currently supports:
    - Arbiscan (Arbitrum)
    """
    
    # Explorer base URLs
    EXPLORER_URLS = {
        'arbitrum': 'https://api.arbiscan.io/api',
    }
    
    def __init__(self):
        # Load API keys from environment variables
        self.api_keys = {
            'arbitrum': os.getenv('ARBISCAN_API_KEY', '')
        }
        
        if not self.api_keys['arbitrum']:
            print("Warning: ARBISCAN_API_KEY not found in environment variables")
    
    async def get_eth_balances_multi(self, chain: str, addresses: List[str]) -> Dict[str, Any]:
        """
        Fetch ETH balances for multiple addresses at once.
        
        Args:
            chain: The blockchain to query (e.g., 'arbitrum')
            addresses: List of addresses to get balances for
        
        Returns:
            Dict containing the response from the API
        """
        if chain not in self.EXPLORER_URLS:
            return {'error': f'Unsupported chain: {chain}'}
        
        if not self.api_keys[chain]:
            return {'error': f'No API key found for {chain}'}
        
        base_url = self.EXPLORER_URLS[chain]
        api_key = self.api_keys[chain]
        
        # Join addresses with commas for the API request
        addresses_str = ','.join(addresses)
        
        # Prepare query parameters
        params = {
            'module': 'account',
            'action': 'balancemulti',
            'address': addresses_str,
            'tag': 'latest',
            'apikey': api_key
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(base_url, params=params) as response:
                    if response.status != 200:
                        return {'error': f'API request failed with status {response.status}'}
                    
                    data = await response.json()
                    
                    # Format the response
                    if data.get('status') == '1':
                        # Convert the wei values to ETH for readability
                        for account in data.get('result', []):
                            if 'balance' in account:
                                # Convert wei to ETH (1 ETH = 10^18 wei)
                                account['balance_eth'] = float(account['balance']) / 10**18
                        
                        return {
                            'status': 'success',
                            'message': data.get('message', ''),
                            'data': data.get('result', [])
                        }
                    else:
                        return {
                            'status': 'error',
                            'message': data.get('message', 'Unknown error'),
                            'error': data.get('result', '')
                        }
        except Exception as e:
            return {'error': f'Exception fetching balances: {str(e)}'}
    
    async def get_eth_balance(self, chain: str, address: str) -> Dict[str, Any]:
        """
        Fetch ETH balance for a single address.
        
        Args:
            chain: The blockchain to query (e.g., 'arbitrum')
            address: The address to get balance for
        
        Returns:
            Dict containing the response from the API
        """
        result = await self.get_eth_balances_multi(chain, [address])
        
        if 'error' in result:
            return result
        
        if result['status'] == 'success' and len(result['data']) > 0:
            return {
                'status': 'success',
                'message': result['message'],
                'data': result['data'][0]  # Return just the first (and only) address
            }
        
        return {'error': 'No data returned for address'} 