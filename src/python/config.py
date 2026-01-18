import os
from dotenv import load_dotenv
import sys

# Try to find .env file in parent directories if not in current
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir)) # plusdot_api root
env_path = os.path.join(parent_dir, '.env')

if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()

class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    @staticmethod
    def validate():
        if not Config.OPENAI_API_KEY:
            print("[Config] Warning: OPENAI_API_KEY not found in environment variables.", file=sys.stderr)
