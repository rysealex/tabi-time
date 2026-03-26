from flask import json, render_template, Blueprint, jsonify
from datetime import datetime, timedelta, timezone
import requests, os, random

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/journal')
def journal():
    return render_template('journal.html')

@main.route('/gallery')
def gallery():
    return render_template('gallery.html')

@main.route('/nihongo')
def nihongo():
    return render_template('nihongo.html')

@main.route('/api/points')
def get_points():
    # Path to the data folder
    data_path = os.path.join(os.getcwd(), 'data', 'points.json')
    with open(data_path, 'r') as f:
        data = json.load(f)
    return jsonify(data)

@main.route('/api/time')
def get_time():
    # Japan is UTC+9
    now_utc = datetime.now(timezone.utc)
    japan_time = now_utc + timedelta(hours=9)
    home_now = datetime.now()
    
    return {
        "japan": japan_time.strftime("%H:%M"),
        "japan_date": japan_time.strftime("%a, %b %d"),
        "home": home_now.strftime("%H:%M"),
        "home_date": home_now.strftime("%a, %b %d")
    }

@main.route('/api/currency')
def get_currency():
    # Fetch the key from the environment
    api_key = os.getenv('EXCHANGE_RATE_API_KEY')

    if not api_key:
        return jsonify({"error": "API Key missing"}), 500

    # Using ExchangeRate-API for simplicity
    url = f"https://v6.exchangerate-api.com/v6/{api_key}/pair/USD/JPY"

    try:
        response = requests.get(url)
        data = response.json()
        current_rate = data['conversion_rate']

        # Generate mock historical data around the current rate for the past 6 days
        mock_history = [round(current_rate * random.uniform(0.98, 1.01), 2) for _ in range(6)]
        mock_history.append(current_rate) # Today's real rate is the last point

        if data['result'] == 'success':
            return jsonify({
                "rate": current_rate,
                "history": mock_history
            })
        else:
            return jsonify({"error": "Failed to fetch exchange rate"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500