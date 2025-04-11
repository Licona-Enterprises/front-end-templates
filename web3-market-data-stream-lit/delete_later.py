# Gets list of balance-updates for a BTC account
import requests
response = requests.get('https://api.coinmetrics.io/v4/blockchain-v2/eth/accounts/0xAa6f663a14b8dA1EB9CF021379f4Ba6BF536268A/balance-updates?start_time=2024-06-10&chain=all&end_time=2025-03-28&pretty=true&api_key=').json()
print(response)
# pretty print the response
import json
print(json.dumps(response, indent=4))

