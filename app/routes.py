from flask import json, render_template, Blueprint, jsonify, request
from datetime import datetime, timedelta, timezone
import requests, os, random

main = Blueprint('main', __name__)

# Helper function to prevent duplicate reading logic
def get_trips_data():
    data_path = os.path.join(os.getcwd(), 'data', 'trips.json')
    if not os.path.exists(data_path):
        with open(data_path, 'w', encoding='utf-8') as f:
            json.dump([], f)
        return []
    with open(data_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_trips_data(data):
    data_path = os.path.join(os.getcwd(), 'data', 'trips.json')
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

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
    data_path = os.path.join(os.getcwd(), 'data', 'points.json')
    with open(data_path, 'r') as f:
        data = json.load(f)
    return jsonify(data)

@main.route('/api/phrases')
def get_phrases():
    data_path = os.path.join(os.getcwd(), 'data', 'phrases.json')
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)

@main.route('/api/time')
def get_time():
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
    api_key = os.getenv('EXCHANGE_RATE_API_KEY')
    if not api_key:
        return jsonify({"error": "API Key missing"}), 500
    url = f"https://v6.exchangerate-api.com/v6/{api_key}/pair/USD/JPY"
    try:
        response = requests.get(url)
        data = response.json()
        current_rate = data['conversion_rate']
        mock_history = [round(current_rate * random.uniform(0.98, 1.01), 2) for _ in range(6)]
        mock_history.append(current_rate)
        if data['result'] == 'success':
            return jsonify({"rate": current_rate, "history": mock_history})
        else:
            return jsonify({"error": "Failed to fetch exchange rate"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
   
@main.route('/api/trips')
def get_trips():
    return jsonify(get_trips_data())

@main.route('/api/trips_add', methods=['POST'])
def add_trip():
    trips = get_trips_data()
    new_payload = request.json
   
    # Generate unique semantic ID via epoch timestamp string to isolate keys cleanly
    new_payload['id'] = f"trip_{int(datetime.now().timestamp())}"
    trips.append(new_payload)
   
    save_trips_data(trips)
    return jsonify({"success": True, "trip": new_payload})

@main.route('/api/trips_edit', methods=['POST'])
def edit_trip():
    trips = get_trips_data()
    edit_payload = request.json
    trip_id = edit_payload.get('id')
   
    for trip in trips:
        if trip.get('id') == trip_id:
            trip['name'] = edit_payload['name']
            trip['start_date'] = edit_payload['start_date']
            trip['end_date'] = edit_payload['end_date']
            break
           
    save_trips_data(trips)
    return jsonify({"success": True})

@main.route('/api/trips_delete', methods=['POST'])
def delete_trip():
    trips = get_trips_data()
    delete_payload = request.json
    trip_id = delete_payload.get('id')
   
    # Filter array to omit matching tracking id profiles
    updated_trips = [t for t in trips if t.get('id') != trip_id]
   
    save_trips_data(updated_trips)
    return jsonify({"success": True})