# Setup

### Install libraries
pip install -r requirements.txt

### Run Front end
streamlit run app/frontend/main.py

### Run Backend
cd app/backend
uvicorn main:app --reload
