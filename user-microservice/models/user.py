class User:
    def __init__(self, id, name, surname, email, role,password):
        self.id = id
        self.name = name
        self.surname = surname
        self.email = email
        self.role = role
        self.password = password
# from app import db

# class User(db.Model):
#     id = db.Column(db.String(240), primary_key=True)
#     name = db.Column(db.String(80), unique=True, nullable=False)
#     surname = db.Column(db.String(80), unique=True, nullable=False)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(120), unique=True, nullable=False)
#     role = db.Column(db.String(120), unique=True, nullable=False)

#     def __repr__(self):
#         return f'<User {self.username}>'
