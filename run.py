import os
from flask import Flask
from app.routes import main
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__, 
                template_folder='app/templates', 
                static_folder='app/static')
    app.register_blueprint(main)
    return app

app = create_app()

if __name__ == "__main__":
    # Host 0.0.0.0 makes it accessible over Tailscale
    app.run(host="0.0.0.0", port=5000, debug=True)