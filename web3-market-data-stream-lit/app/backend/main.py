import os
import sys
from dotenv import load_dotenv
import pandas as pd
from io import BytesIO
from fastapi import FastAPI, Query, Response
from fastapi.responses import StreamingResponse
from typing import Optional, List, Dict, Any
import json

# Fix import paths by adding the current directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import FastAPI and other modules
from fastapi import FastAPI, Query
from typing import Optional, List, Dict, Any

# Now import local modules
from consts import DEFAULT_ASSETS, METRIC_FREQUENCIES, PORTFOLIOS
from coinmetrics import CoinMetricsService
from web3_uniswap_position_calculator import get_uniswap_wallet_addresses, process_positions
from web3_aave_position_calculator import get_aave_wallet_addresses, get_wallet_aave_positions

load_dotenv()

app = FastAPI()

# Initialize services
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
        
        # Convert Query objects to plain strings
        portfolio_str = str(portfolio) if portfolio is not None else None
        wallet_address_str = str(wallet_address) if wallet_address is not None else None
        
        # Filter wallets by portfolio if specified
        if portfolio_str:
            wallet_addresses = [w for w in wallet_addresses if w["portfolio"] == portfolio_str]
            
            if not wallet_addresses:
                return {"error": f"No wallets found in portfolio '{portfolio_str}'"}
        
        # Filter by specific wallet address if provided
        if wallet_address_str:
            wallet_addresses = [w for w in wallet_addresses if w["address"].lower() == wallet_address_str.lower()]
            
            if not wallet_addresses:
                return {"error": f"Wallet address '{wallet_address_str}' not found or has no Uniswap positions"}
        
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

@app.get("/api/aave/positions")
async def get_aave_positions(
    portfolio: Optional[str] = Query(default=None),
    wallet_address: Optional[str] = Query(default=None),
    aave_protocol_only: bool = Query(default=False)
):
    """
    Get Aave token positions data for wallets.
    
    Args:
        portfolio: Optional filter by portfolio name
        wallet_address: Optional filter by specific wallet address
        aave_protocol_only: If True, only return positions from wallets where Aave is listed as an active protocol
    
    Returns:
        List of Aave token positions
    """
    try:
        # Get wallet addresses with Aave tokens or with active Aave protocol
        wallet_addresses = get_aave_wallet_addresses()
        
        if not wallet_addresses:
            return {"error": "No wallets with Aave positions found"}
        
        # Convert Query objects to plain strings
        portfolio_str = str(portfolio) if portfolio is not None else None
        wallet_address_str = str(wallet_address) if wallet_address is not None else None
        
        # Filter by aave_protocol_only flag if specified
        if aave_protocol_only:
            wallet_addresses = [
                w for w in wallet_addresses 
                if any("aave" in protocols for protocols in [
                    PORTFOLIOS.get(w["portfolio"], {})
                    .get("STRATEGY_WALLETS", {})
                    .get(w.get("strategy", ""), {})
                    .get("active_protocols", [])
                ])
            ]
            if not wallet_addresses:
                return {"error": "No wallets with Aave as active protocol found"}
        
        # Filter wallets by portfolio if specified
        if portfolio_str:
            wallet_addresses = [w for w in wallet_addresses if w["portfolio"] == portfolio_str]
            if not wallet_addresses:
                return {"error": f"No wallets found in portfolio '{portfolio_str}'"}
        
        # Filter by specific wallet address if provided
        if wallet_address_str:
            wallet_addresses = [w for w in wallet_addresses if w["address"].lower() == wallet_address_str.lower()]
            if not wallet_addresses:
                return {"error": f"Wallet address '{wallet_address_str}' not found or has no Aave positions"}
        
        # Process all Aave positions across wallets
        all_positions = []
        for wallet_info in wallet_addresses:
            position_data = get_wallet_aave_positions(wallet_info)
            
            # Only include positions with tokens
            if position_data["tokens"]:
                all_positions.append(position_data)
        
        return {
            "count": len(all_positions),
            "wallets": all_positions
        }
        
    except Exception as e:
        return {"error": f"Error retrieving Aave positions: {str(e)}"}

@app.get("/api/aave/positions/protocol-only")
async def get_aave_protocol_positions(
    portfolio: Optional[str] = Query(default=None),
    wallet_address: Optional[str] = Query(default=None)
):
    """
    Get Aave token positions data only for wallets where Aave is listed as an active protocol.
    
    Args:
        portfolio: Optional filter by portfolio name
        wallet_address: Optional filter by specific wallet address
    
    Returns:
        List of Aave token positions
    """
    # Convert Query objects to strings if needed
    portfolio_str = str(portfolio) if portfolio else None
    wallet_address_str = str(wallet_address) if wallet_address else None
    
    # Reuse the existing endpoint with aave_protocol_only set to True
    return await get_aave_positions(portfolio_str, wallet_address_str, aave_protocol_only=True)

@app.get("/api/report/positions-excel")
async def generate_excel_report(
    portfolio: Optional[str] = Query(default=None),
    include_aave: bool = Query(default=True),
    include_uniswap: bool = Query(default=True)
):
    """
    Generate an Excel report with detailed information about AAVE and Uniswap positions.
    
    Args:
        portfolio: Optional filter by portfolio name
        include_aave: Whether to include AAVE positions in the report
        include_uniswap: Whether to include Uniswap positions in the report
    
    Returns:
        Excel file as a streaming response
    """
    try:
        # Convert Query objects to their string values if needed
        portfolio_str = str(portfolio) if portfolio is not None else None
        
        # Create a BytesIO object to store the Excel file
        excel_file = BytesIO()
        
        # Debug information
        debug_info = {
            "portfolio_filter": portfolio_str,
            "include_aave": include_aave,
            "include_uniswap": include_uniswap,
            "aave_data_present": False,
            "uniswap_data_present": False,
            "aave_count": 0,
            "uniswap_count": 0,
            "errors": [],
            "query_params": {"portfolio": portfolio_str, "include_aave": include_aave, "include_uniswap": include_uniswap}
        }
        
        print(f"Generating Excel report with params: portfolio={portfolio_str}, include_aave={include_aave}, include_uniswap={include_uniswap}")
        
        # Create a Pandas Excel writer
        with pd.ExcelWriter(excel_file, engine='xlsxwriter') as writer:
            # Get AAVE positions if requested
            if include_aave:
                try:
                    print("Fetching AAVE positions for Excel report...")
                    
                    # Get wallet addresses directly instead of using the API
                    wallet_addresses = get_aave_wallet_addresses()
                    
                    # Filter by portfolio if needed
                    if portfolio_str:
                        wallet_addresses = [w for w in wallet_addresses if w["portfolio"] == portfolio_str]
                        if not wallet_addresses:
                            print(f"No AAVE wallets found for portfolio: {portfolio_str}")
                    
                    # Filter by AAVE protocol only
                    wallet_addresses = [
                        w for w in wallet_addresses 
                        if any("aave" in protocols for protocols in [
                            PORTFOLIOS.get(w["portfolio"], {})
                            .get("STRATEGY_WALLETS", {})
                            .get(w.get("strategy", ""), {})
                            .get("active_protocols", [])
                        ])
                    ]
                    
                    # Process all AAVE positions across wallets
                    all_positions = []
                    for wallet_info in wallet_addresses:
                        try:
                            position_data = get_wallet_aave_positions(wallet_info)
                            
                            # Only include positions with tokens
                            if position_data["tokens"]:
                                all_positions.append(position_data)
                        except Exception as wallet_e:
                            print(f"Error processing AAVE wallet {wallet_info['address']}: {str(wallet_e)}")
                    
                    debug_info["aave_data_present"] = len(all_positions) > 0
                    debug_info["aave_count"] = len(all_positions)
                    print(f"Found {debug_info['aave_count']} AAVE positions directly")
                    
                    if all_positions:
                        # Process AAVE data into a flat format for Excel
                        aave_rows = []
                        for wallet in all_positions:
                            wallet_address = wallet.get("wallet_address", "")
                            portfolio_name = wallet.get("portfolio", "")
                            strategy = wallet.get("strategy", "")
                            
                            for token in wallet.get("tokens", []):
                                aave_rows.append({
                                    "Wallet Address": wallet_address,
                                    "Portfolio": portfolio_name,
                                    "Strategy": strategy,
                                    "Token Symbol": token.get("symbol", ""),
                                    "Token Name": token.get("name", ""),
                                    "Token Address": token.get("address", ""),
                                    "Amount": token.get("amount", 0),
                                    "Raw Amount": token.get("raw_amount", 0),
                                    "Decimals": token.get("decimals", 0),
                                    "Network": token.get("network", ""),
                                    "Token ID": token.get("token_id", "")
                                })
                        
                        # Create DataFrame and write to Excel
                        if aave_rows:
                            aave_df = pd.DataFrame(aave_rows)
                            aave_df.to_excel(writer, sheet_name="AAVE Positions", index=False)
                            print(f"Added {len(aave_rows)} AAVE rows to Excel report")
                            
                            # Auto-adjust column widths
                            for column in aave_df:
                                column_width = max(aave_df[column].astype(str).map(len).max(), len(column)) + 2
                                col_idx = aave_df.columns.get_loc(column)
                                writer.sheets["AAVE Positions"].set_column(col_idx, col_idx, column_width)
                    else:
                        print("⚠️ NO AAVE POSITIONS FOUND")
                        # Add an empty AAVE sheet
                        empty_df = pd.DataFrame([{"Message": "No AAVE positions found"}])
                        empty_df.to_excel(writer, sheet_name="AAVE Positions", index=False)
                        print("ADDED EMPTY AAVE SHEET")
                        
                except Exception as e:
                    error_msg = f"Error processing AAVE data: {str(e)}"
                    print(f"AAVE data error: {error_msg}")
                    debug_info["errors"].append(error_msg)
            
            # Get Uniswap positions if requested
            if include_uniswap:
                try:
                    print("**** FETCHING UNISWAP DATA FOR EXCEL REPORT ****")
                    
                    # Instead of using the API endpoint, directly get wallet addresses and process positions
                    wallet_addresses = get_uniswap_wallet_addresses()
                    
                    # Filter by portfolio if needed
                    if portfolio_str:
                        wallet_addresses = [w for w in wallet_addresses if w["portfolio"] == portfolio_str]
                        if not wallet_addresses:
                            print(f"No Uniswap wallets found for portfolio: {portfolio_str}")
                    
                    # Process all positions across all wallets directly
                    all_positions = []
                    
                    for wallet_info in wallet_addresses:
                        print(f"Processing Uniswap wallet: {wallet_info['address']}")
                        positions_data = list(process_positions(wallet_info))
                        
                        # Add wallet info to each position
                        for position in positions_data:
                            if "error" not in position:
                                position["wallet_address"] = wallet_info["address"]
                                position["portfolio"] = wallet_info["portfolio"]
                                if "strategy" in wallet_info:
                                    position["strategy"] = wallet_info["strategy"]
                        
                        # Only include valid positions (no errors)
                        valid_wallet_positions = [p for p in positions_data if "error" not in p]
                        all_positions.extend(valid_wallet_positions)
                    
                    # Use the direct positions list
                    positions = all_positions
                    positions_count = len(positions)
                    debug_info["uniswap_count"] = positions_count
                    
                    print(f"FOUND {positions_count} UNISWAP POSITIONS DIRECTLY")
                    
                    # Dump first position for debugging
                    if positions_count > 0:
                        first_pos = positions[0]
                        print(f"FIRST POSITION: {first_pos}")
                        pos_id = first_pos.get("token_id", "unknown")
                        print(f"FIRST POSITION ID: {pos_id}")
                        print(f"SAMPLE POSITION KEYS: {list(first_pos.keys())}")
                        
                        # Direct and simple approach - just add all fields to Excel
                        excel_positions = []
                        
                        for pos in positions:
                            # Create row with all available fields to debug
                            row = {}
                            for key, value in pos.items():
                                if isinstance(value, (str, int, float, bool)) or value is None:
                                    row[key] = value
                                elif isinstance(value, dict):
                                    # Flatten one level for nested objects like token0, token1
                                    for sub_key, sub_value in value.items():
                                        if isinstance(sub_value, (str, int, float, bool)) or sub_value is None:
                                            row[f"{key}_{sub_key}"] = sub_value
                            excel_positions.append(row)
                        
                        # Create DataFrame and add to Excel
                        uniswap_df = pd.DataFrame(excel_positions)
                        print(f"ADDING UNISWAP SHEET WITH {len(excel_positions)} POSITIONS")
                        print(f"COLUMNS: {list(uniswap_df.columns)}")
                        
                        # Write to Excel
                        uniswap_df.to_excel(writer, sheet_name="Uniswap Positions", index=False)
                        print("✅ UNISWAP POSITIONS ADDED TO EXCEL REPORT!")
                        
                        # Auto-adjust column widths
                        worksheet = writer.sheets["Uniswap Positions"]
                        for idx, col in enumerate(uniswap_df.columns):
                            # Ensure column width is adequate
                            max_len = max(uniswap_df[col].astype(str).map(len).max(), len(col)) + 2
                            worksheet.set_column(idx, idx, max_len)
                    else:
                        print("⚠️ NO POSITIONS FOUND")
                        # Add an empty Uniswap sheet
                        empty_df = pd.DataFrame([{"Message": "No Uniswap positions found"}])
                        empty_df.to_excel(writer, sheet_name="Uniswap Positions", index=False)
                        print("ADDED EMPTY UNISWAP SHEET")
                
                except Exception as e:
                    print(f"❌❌❌ ERROR PROCESSING UNISWAP DATA: {str(e)}")
                    # Add error info to Excel
                    error_df = pd.DataFrame([{"Error": f"Exception: {str(e)}"}])
                    error_df.to_excel(writer, sheet_name="Uniswap Error", index=False)
                    debug_info["errors"].append(f"Uniswap error: {str(e)}")
            
            # Add a summary sheet
            summary_data = {
                "Report Information": [
                    "Report Generated At", pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "Portfolio Filter", portfolio_str if portfolio_str else "All Portfolios",
                    "AAVE Positions Included", "Yes" if include_aave else "No",
                    "AAVE Positions Count", debug_info["aave_count"],
                    "Uniswap Positions Included", "Yes" if include_uniswap else "No",
                    "Uniswap Positions Count", debug_info["uniswap_count"]
                ]
            }
            
            # Add debug info
            if debug_info["errors"]:
                for i, error in enumerate(debug_info["errors"]):
                    summary_data["Report Information"].extend([f"Error {i+1}", error])
            
            summary_df = pd.DataFrame(summary_data)
            summary_df.to_excel(writer, sheet_name="Summary", index=False, header=False)
            print("Added Summary sheet to Excel report")
            
            # Add Market Data sheet
            try:
                # Get latest market data for common assets
                assets = DEFAULT_ASSETS
                metrics = ["ReferenceRate"]  # Just get current prices
                print(f"Fetching market data for Excel report...")
                
                # Get market data
                market_data = await get_market_data(metrics, assets)
                
                if market_data and "data" in market_data:
                    # Create a DataFrame for market data
                    market_rows = []
                    
                    # Process the data
                    for item in market_data["data"]:
                        if "asset" in item and "ReferenceRate" in item:
                            market_rows.append({
                                "Asset": item["asset"].upper(),
                                "Price (USD)": float(item["ReferenceRate"]),
                                "Time": pd.to_datetime(item["time"]).strftime("%Y-%m-%d %H:%M:%S") if "time" in item else ""
                            })
                    
                    # Sort by asset name
                    market_rows.sort(key=lambda x: x["Asset"])
                    
                    # Create DataFrame and write to Excel
                    if market_rows:
                        market_df = pd.DataFrame(market_rows)
                        market_df.to_excel(writer, sheet_name="Market Data", index=False)
                        print(f"Added {len(market_rows)} Market Data rows to Excel report")
                        
                        # Auto-adjust column widths
                        for column in market_df:
                            column_width = max(market_df[column].astype(str).map(len).max(), len(column)) + 2
                            col_idx = market_df.columns.get_loc(column)
                            writer.sheets["Market Data"].set_column(col_idx, col_idx, column_width)
            except Exception as e:
                error_msg = f"Error adding market data sheet: {str(e)}"
                print(f"Market data error: {error_msg}")
                debug_info["errors"].append(error_msg)
            
            # Add debug sheet
            debug_df = pd.DataFrame([debug_info])
            debug_df.to_excel(writer, sheet_name="Debug Info", index=False)
            print("Added Debug Info sheet to Excel report")
            
            # Auto-adjust column widths for summary
            writer.sheets["Summary"].set_column(0, 0, 25)
            writer.sheets["Summary"].set_column(1, 1, 35)
        
        # Seek to the beginning of the file
        excel_file.seek(0)
        
        # Calculate final file size for logging
        file_size = excel_file.getbuffer().nbytes
        sheet_names = ["Summary", "AAVE Positions", "Uniswap Positions", "Market Data", "Debug Info"]
        print(f"Excel report generated successfully. Size: {file_size} bytes. Sheets: {sheet_names}")
        
        # Return the Excel file as a streaming response
        return StreamingResponse(
            excel_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=positions_report.xlsx"}
        )
    
    except Exception as e:
        error_msg = f"Error generating Excel report: {str(e)}"
        print(f"Excel report generation failed: {error_msg}")
        return {"error": error_msg}

@app.get("/api/test/uniswap-config")
async def test_uniswap_config():
    """
    Test endpoint to check the Uniswap wallet configuration.
    
    Returns:
        Dictionary with configuration info
    """
    try:
        # Get wallet addresses with Uniswap V3 positions
        wallet_addresses = get_uniswap_wallet_addresses()
        
        # Return configuration info
        return {
            "status": "success",
            "wallet_count": len(wallet_addresses),
            "wallets": wallet_addresses,
            "portfolios": list(PORTFOLIOS.keys()),
            "portfolio_details": PORTFOLIOS
        }
    except Exception as e:
        return {"error": f"Error in test_uniswap_config: {str(e)}"}
