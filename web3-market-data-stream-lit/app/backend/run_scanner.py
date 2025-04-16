#!/usr/bin/env python3

from block_explorers import AaveUniswapScanner

def main():
    scanner = AaveUniswapScanner()

    print("Fetching Aave Token Balances:\n")
    balances = scanner.fetch_all_balances()
    for key, value in balances.items():
        chain, label, wallet, token = key
        print(f"[{chain.upper()}] {label}: {wallet} -> {token} Balance: {value}")

    # Temporarily disabled until new API is provided
    # print("\nFetching Uniswap NFT Positions:\n")
    # positions = scanner.fetch_all_uniswap_positions()
    # for key, pos_list in positions.items():
    #     chain, label, wallet = key
    #     print(f"[{chain.upper()}] {label}: {wallet} -> {len(pos_list)} positions")
    
    print("\nUniswap position scanning is temporarily disabled. Will be updated with new API.")

if __name__ == "__main__":
    main() 