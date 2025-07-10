import pandas as pd
import matplotlib.pyplot as plt

# Load the log file
df = pd.read_csv('chat_stats_cleaned.log', names=['timestamp', 'event', 'user_id', 'conversation_id', 'extra'])

# Convert timestamp to datetime
df['timestamp'] = pd.to_datetime(df['timestamp'])  # ← cette ligne est OBLIGATOIRE
df['full_time'] = df['timestamp']                  # Facultatif si tu veux conserver l'heure exacte
df['date'] = df['timestamp'].dt.date               # Juste la date (ex: 2025-07-06)
df['hour'] = df['timestamp'].dt.floor('h')         # Heure arrondie (ex: 2025-07-06 17:00)

# Messages sent per hour
msg_hourly_counts = df[df['event'] == 'send_message'].groupby('hour').size()
if not msg_hourly_counts.empty:
    msg_hourly_counts.plot(kind='bar', figsize=(12, 6), color='skyblue')
    plt.title('Messages sent per hour')
    plt.xlabel('Hour (with date)')
    plt.ylabel('Number of messages')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
else:
    print("No message events to plot.")

# Messages sent per day
msg_counts = df[df['event'] == 'send_message'].groupby('date').size()
if not msg_counts.empty:
    msg_counts.plot(kind='bar')
    plt.title('Messages sent per day')
    plt.xlabel('Date')
    plt.ylabel('Number of messages')
    plt.tight_layout()
    plt.show()
else:
    print("No message events to plot.")

# Messages sent per user
msg_user_counts = df[df['event'] == 'send_message'].groupby('user_id').size()
if not msg_user_counts.empty:
    msg_user_counts.plot(kind='bar')
    plt.title('Messages sent per user')
    plt.xlabel('User ID')
    plt.ylabel('Number of messages')
    plt.tight_layout()
    plt.show()
else:
    print("No user message events to plot.")

# Logins per day
login_counts = df[df['event'] == 'login'].groupby('date').size()
if not login_counts.empty:
    login_counts.plot(kind='bar', color='orange')
    plt.title('Logins per day')
    plt.xlabel('Date')
    plt.ylabel('Number of logins')
    plt.tight_layout()
    plt.show()
else:
    print("No login events to plot.")

# Registrations per day
register_counts = df[df['event'] == 'register'].groupby('date').size()
if not register_counts.empty:
    register_counts.plot(kind='bar', color='green')
    plt.title('Registrations per day')
    plt.xlabel('Date')
    plt.ylabel('Number of registrations')
    plt.tight_layout()
    plt.show()
else:
    print("No registration events to plot.")

# Profile updates per day
profile_update_counts = df[df['event'] == 'update_profile'].groupby('date').size()
if not profile_update_counts.empty:
    profile_update_counts.plot(kind='bar', color='purple')
    plt.title('Profile updates per day')
    plt.xlabel('Date')
    plt.ylabel('Number of updates')
    plt.tight_layout()
    plt.show()
else:
    print("No profile update events to plot.")

# Account deletions per day
delete_counts = df[df['event'] == 'delete_profile'].groupby('date').size()
if not delete_counts.empty:
    delete_counts.plot(kind='bar', color='red')
    plt.title('Account deletions per day')
    plt.xlabel('Date')
    plt.ylabel('Number of deletions')
    plt.tight_layout()
    plt.show()
else:
    print("No account deletion events to plot.")

# Messages per conversation
msg_conv_counts = df[df['event'] == 'send_message'].groupby('conversation_id').size()
if not msg_conv_counts.empty:
    msg_conv_counts.plot(kind='bar', color='teal')
    plt.title('Messages per conversation')
    plt.xlabel('Conversation ID')
    plt.ylabel('Number of messages')
    plt.tight_layout()
    plt.show()
else:
    print("No conversation message events to plot.")

# Unique active users per day
active_users = df[df['event'].isin(['send_message', 'login'])].groupby('date')['user_id'].nunique()
if not active_users.empty:
    active_users.plot(kind='bar', color='brown')
    plt.title('Active users per day')
    plt.xlabel('Date')
    plt.ylabel('Number of active users')
    plt.tight_layout()
    plt.show()
else:
    print("No active user events to plot.")
