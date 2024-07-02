import sqlite3
conn = sqlite3.connect('user_database.db')
print("Connected to database successfully")

conn.execute('CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT, surname TEXT, email TEXT, role TEXT, password TEXT)')
print("Created table successfully!")

conn.close()