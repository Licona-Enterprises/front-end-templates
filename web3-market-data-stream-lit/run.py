import os
import subprocess
import sys
import signal
import time

# Get the absolute path to the project root
project_root = os.path.dirname(os.path.abspath(__file__))

# Set up environment variables for Python path
env = os.environ.copy()
app_path = os.path.join(project_root, "app")
backend_path = os.path.join(app_path, "backend")
if "PYTHONPATH" in env:
    env["PYTHONPATH"] = f"{app_path}:{backend_path}:{env['PYTHONPATH']}"
else:
    env["PYTHONPATH"] = f"{app_path}:{backend_path}"

# Define backend and frontend commands
backend_cmd = ["python", "-m", "uvicorn", "app.backend.main:app", "--reload", "--port", "8000"]
frontend_cmd = ["streamlit", "run", "app/frontend/main.py"]

# Start processes
processes = []

def signal_handler(sig, frame):
    print("Shutting down processes...")
    for proc in processes:
        if proc.poll() is None:  # If process is still running
            proc.terminate()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

try:
    print("Starting FastAPI backend...")
    print(f"PYTHONPATH: {env['PYTHONPATH']}")
    backend_proc = subprocess.Popen(backend_cmd, cwd=project_root, env=env)
    processes.append(backend_proc)
    
    # Give the backend a moment to start
    time.sleep(2)
    
    print("Starting Streamlit frontend...")
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=project_root, env=env)
    processes.append(frontend_proc)
    
    # Keep the script running
    while all(proc.poll() is None for proc in processes):
        time.sleep(1)
        
except Exception as e:
    print(f"Error: {e}")
finally:
    # Make sure to clean up processes on exit
    for proc in processes:
        if proc.poll() is None:
            proc.terminate() 