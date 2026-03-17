from flask import render_template
from flask import Blueprint

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/journal')
def journal():
    return render_template('journal.html')