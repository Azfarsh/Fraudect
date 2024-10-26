from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=128)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
from django.db import models

class UserRegistration(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=50, default='John')  # Default first name
    last_name = models.CharField(max_length=50, default='Doe')   # Default last name
    phone_number = models.CharField(max_length=15, default='1234567890')  # Default phone number
    country = models.CharField(max_length=50, default='USA')  # Default country
    state = models.CharField(max_length=50, default='CA')  # Default state
    country_code = models.CharField(max_length=5, default='+1')  # Default country code
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class SmsMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    from_number = models.CharField(max_length=15)
    body = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.from_number} to {self.user.username}"
