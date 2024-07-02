import sqlite3
import bcrypt
class UserRepository:
    def __init__(self):
        self.db_path = "./user_database.db"

    def insert_user(self, user):
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        hashed_password = self.hash_password(user['password'])
        query = "INSERT INTO users (id, name, surname, email, role, password) VALUES (?, ?, ?, ?, ?, ?)"
        cursor.execute(query, (user['id'], user['name'], user['surname'], user['email'], user['role'], hashed_password))
        conn.commit()
        conn.close()

    def update_user(self, user_id,user_data):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        hashed_password = self.hash_password(user_data['password'])
        query = "UPDATE users SET name = ?, surname = ?, email = ?, role = ?, password = ? WHERE id = ?"
        cursor.execute(query, (user_data['name'], user_data['surname'], user_data['email'], user_data['role'], hashed_password, user_id))
        conn.commit()
        conn.close()
        
    def hash_password(self, password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password
    
    def find_by_email_and_password(self, email, password):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        query = "SELECT * FROM users WHERE email = ?"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        conn.close()
        if result is None:
            return None
        stored_password = result[5]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return {
            'id': result[0],
            'name': result[1],
            'surname': result[2],
            'email': result[3],
            'role': result[4]
            }
        else:
            return None
