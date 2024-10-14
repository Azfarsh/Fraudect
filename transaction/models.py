from django.db import models

class UserDetails(models.Model):
    user_id = models.AutoField(primary_key=True)  # Auto-incremented user ID
    username = models.CharField(max_length=100, unique=True)  # Username
    phone = models.CharField(max_length=15)  # Phone number (you can customize length)
    email = models.EmailField(max_length=100, unique=True)  # Email
    def __str__(self):
        return self.username  # This will show the username in the Django admin panel
