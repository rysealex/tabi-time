from flask import render_template
from flask import Blueprint
from datetime import datetime, timedelta, timezone

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/journal')
def journal():
    return render_template('journal.html')

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