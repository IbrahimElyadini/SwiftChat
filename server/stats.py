from flask import Blueprint, jsonify
import subprocess
import pandas as pd

def create_stats_blueprint():
    stats_bp = Blueprint('stats', __name__)

    def clean_and_load():
        subprocess.run(['python', 'clean_up.py'])
        df = pd.read_csv('chat_stats_cleaned.log', names=['timestamp', 'event', 'user_id', 'conversation_id', 'extra'])
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['date'] = df['timestamp'].dt.date
        df['hour'] = df['timestamp'].dt.floor('h')
        return df

    def safe_jsonify(series):
        return jsonify({str(k): int(v) for k, v in series.items()})

    @stats_bp.route('/messages/hourly')
    def messages_per_hour():
        df = clean_and_load()
        counts = df[df['event'] == 'send_message'].groupby('hour').size()
        return safe_jsonify(counts)

    @stats_bp.route('/messages/daily')
    def messages_per_day():
        df = clean_and_load()
        counts = df[df['event'] == 'send_message'].groupby('date').size()
        return safe_jsonify(counts)

    @stats_bp.route('/messages/per_user')
    def messages_per_user():
        df = clean_and_load()
        counts = df[df['event'] == 'send_message'].groupby('user_id').size()
        return safe_jsonify(counts)

    @stats_bp.route('/logins/daily')
    def logins_per_day():
        df = clean_and_load()
        counts = df[df['event'] == 'login'].groupby('date').size()
        return safe_jsonify(counts)

    @stats_bp.route('/registrations/daily')
    def registrations_per_day():
        df = clean_and_load()
        counts = df[df['event'] == 'register'].groupby('date').size()
        return safe_jsonify(counts)

    @stats_bp.route('/profile_updates/daily')
    def updates_per_day():
        df = clean_and_load()
        counts = df[df['event'] == 'update_profile'].groupby('date').size()
        return safe_jsonify(counts)

    @stats_bp.route('/deletions/daily')
    def deletions_per_day():
        df = clean_and_load()
        counts = df[df['event'] == 'delete_profile'].groupby('date').size()
        return safe_jsonify(counts)

    @stats_bp.route('/messages/per_conversation')
    def messages_per_conversation():
        df = clean_and_load()
        counts = df[df['event'] == 'send_message'].groupby('conversation_id').size()
        return safe_jsonify(counts)

    @stats_bp.route('/active_users/daily')
    def active_users_per_day():
        df = clean_and_load()
        counts = df[df['event'].isin(['send_message', 'login'])].groupby('date')['user_id'].nunique()
        return safe_jsonify(counts)

    return stats_bp
