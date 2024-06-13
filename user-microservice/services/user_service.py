from repositories.user_repository import UserRepository

class UserService:
    def __init__(self):
        self.user_repository = UserRepository()

    def create_user(self, user_data):
        user = self.user_repository.insert_user(user_data)
        return user

    def update_user(self, user_id, user_data):
        user = self.user_repository.update_user(user_id, user_data)
        return user

    def find_by_email_and_password(self, email, password):
        user = self.user_repository.find_by_email_and_password(email, password)
        return user