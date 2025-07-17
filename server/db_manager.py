from flask_mysqldb import MySQL

class DBManager:
    def __init__(self, app):
        self.mysql = MySQL(app)

    def add_user(self, username, email, password_hash):
        cur = self.mysql.connection.cursor()
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password_hash)
        )
        self.mysql.connection.commit()
        cur.close()

    def get_user_by_id(self, user_id):
        cur = self.mysql.connection.cursor()
        cur.execute("SELECT username FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        cur.close()
        return user

    def conversation_exists(self, user1_id, user2_id):
        cur = self.mysql.connection.cursor()
        cur.execute("""
            SELECT cm1.conversation_id FROM conversation_members cm1
            JOIN conversation_members cm2
            ON cm1.conversation_id = cm2.conversation_id
            WHERE cm1.user_id = %s AND cm2.user_id = %s
            GROUP BY cm1.conversation_id
            HAVING COUNT(*) = 2
        """, (user1_id, user2_id))
        existing = cur.fetchone()
        cur.close()
        return existing

    def create_conversation(self, conversation_name, user1_id, user2_id):
        cur = self.mysql.connection.cursor()
        cur.execute("INSERT INTO conversations (name) VALUES (%s)", (conversation_name,))
        conversation_id = cur.lastrowid
        cur.execute("INSERT INTO conversation_members (conversation_id, user_id) VALUES (%s, %s)", (conversation_id, user1_id))
        cur.execute("INSERT INTO conversation_members (conversation_id, user_id) VALUES (%s, %s)", (conversation_id, user2_id))
        self.mysql.connection.commit()
        cur.close()
        return conversation_id

    def send_message(self, conversation_id, sender_id, message):
        cur = self.mysql.connection.cursor()
        cur.execute(
            "INSERT INTO messages (conversation_id, sender_id, message) VALUES (%s, %s, %s)",
            (conversation_id, sender_id, message)
        )
        self.mysql.connection.commit()
        cur.close()

    def get_messages(self, conversation_id):
        cur = self.mysql.connection.cursor()
        cur.execute(
            "SELECT sender_id, message, sent_at FROM messages WHERE conversation_id = %s ORDER BY sent_at ASC",
            (conversation_id,)
        )
        messages = cur.fetchall()
        cur.close()
        return messages

    def user_exists(self, username, email):
        cur = self.mysql.connection.cursor()
        cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        exists = cur.fetchone()
        cur.close()
        return exists is not None
    
    def get_all_users(self):
        cur = self.mysql.connection.cursor()
        cur.execute("SELECT id, username, email, avatar, bio FROM users")
        users = cur.fetchall()
        cur.close()
        return users

    def get_user_by_username(self, username):
        cur = self.mysql.connection.cursor()
        cur.execute("SELECT id, username, email, password_hash FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        cur.close()
        return user

    def conversation_id_exists(self, conversation_id):
        cur = self.mysql.connection.cursor()
        cur.execute("SELECT id FROM conversations WHERE id = %s", (conversation_id,))
        exists = cur.fetchone()
        cur.close()
        return exists is not None

    def is_user_in_conversation(self, user_id, conversation_id):
        cur = self.mysql.connection.cursor()
        cur.execute(
            "SELECT 1 FROM conversation_members WHERE user_id = %s AND conversation_id = %s",
            (user_id, conversation_id)
        )
        result = cur.fetchone()
        cur.close()
        return result is not None
    
    def get_conversations_for_user(self, user_id):
        cur = self.mysql.connection.cursor()
        cur.execute("""
            SELECT c.id, c.name, c.created_at 
            FROM conversations c
            JOIN conversation_members cm ON c.id = cm.conversation_id
            WHERE cm.user_id = %s
            ORDER BY c.created_at DESC
        """, (user_id,))
        conversations = cur.fetchall()
        cur.close()
        return conversations


    def get_user_profile(self, user_id):
        cur = self.mysql.connection.cursor()
        cur.execute("SELECT id, username, email, avatar, bio FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        cur.close()
        return user

    def update_user_profile(self, user_id, avatar, bio):
        cur = self.mysql.connection.cursor()
        cur.execute("UPDATE users SET avatar = %s, bio = %s WHERE id = %s", (avatar, bio, user_id))
        self.mysql.connection.commit()
        cur.close()

    def delete_user(self, user_id):
        cur = self.mysql.connection.cursor()
        cur.execute("DELETE FROM messages WHERE sender_id = %s", (user_id,))
        cur.execute("DELETE FROM conversation_members WHERE user_id = %s", (user_id,))
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        self.mysql.connection.commit()
        cur.close() 

    def update_user_password(self, user_id, hashed_pw):
        cur = self.mysql.connection.cursor()
        cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (hashed_pw, user_id))
        self.mysql.connection.commit()
        cur.close()