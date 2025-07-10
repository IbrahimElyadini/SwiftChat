import logging

# Create a dedicated logger for stats
stats_logger = logging.getLogger("chat_stats")
stats_logger.setLevel(logging.INFO)

# Prevent propagation to the root logger
stats_logger.propagate = False

# Add file handler only if not already added (avoid duplicate logs)
if not stats_logger.handlers:
    handler = logging.FileHandler('chat_stats.log')
    formatter = logging.Formatter('%(asctime)s,%(message)s')
    handler.setFormatter(formatter) 
    stats_logger.addHandler(handler)

def log_event(event_type, user_id=None, conversation_id=None, extra=None):
    # Compose a CSV-like log line
    line = f"{event_type},{user_id},{conversation_id},{extra if extra else ''}"
    stats_logger.info(line)