# transaction/views.py
from django.shortcuts import render
from .models import UserRegistration
def home(request):
    return render(request, 'home.html')  # Ensure this template exists

def login_view(request):
    return render(request, 'login.html')  # Ensure this template exists

def register(request):
    return render(request, 'register.html')  # Ensure this template exists

def dashboard(request):
    return render(request, 'dashboard.html')  # Ensure this template exists

def about(request):
    return render(request, 'about.html')  # Ensure this template exists

def alerts(request):
    return render(request, 'alerts.html')  # Ensure this template exists

def forgot_password(request):
    return render(request, 'forgot_password.html')  # Ensure this template exists

def confirm_otp(request, uidb64):
    return render(request, 'confirm_otp.html')  # Ensure this template exists
# views.py

from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import SmsMessage  # Import your SmsMessage model
from twilio.twiml.messaging_response import MessagingResponse  # Import Twilio's MessagingResponse

def sms_webhook(request):
    if request.method == 'POST':
        from_number = request.POST.get('From', '')
        message_body = request.POST.get('Body', '')

        try:
            # Find the user associated with this phone number
            user = User.objects.get(profile__phone_number=from_number)  # Assuming you have a profile with phone_number
            
            # Create a new SMS message record
            SmsMessage.objects.create(user=user, from_number=from_number, body=message_body)

            # Respond back to Twilio
            resp = MessagingResponse()
            resp.message("Message received!")
            return HttpResponse(resp.to_xml(), content_type='application/xml')

        except User.DoesNotExist:
            # Handle the case where the user is not found
            return HttpResponse("User not found", status=404)

    return HttpResponse(status=405)  # Method not allowed if not POST


# views.py

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, "Login successful.")
            return redirect('dashboard')  # Redirect to the dashboard
        else:
            messages.error(request, "Invalid username or password.")
            return render(request, 'login.html', {'error': "Invalid username or password."})  # Pass the error to the template

    return render(request, 'login.html')  # Render the login template for GET requests

# views.py

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import login

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        
        # Check if passwords match
        if password1 != password2:
            messages.error(request, "Passwords do not match.")
            return redirect('register')
        
        try:
            # Create the user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1
            )
            
            # Create user registration entry
            UserRegistration.objects.create(
                username=username,
                email=email,
                password=password1  # You may want to hash this before saving
            )
            
            # Instead of logging in the user, redirect to the login page
            messages.success(request, "Registration successful. Please log in.")
            return redirect('login')  # Redirect to the login page
            
        except Exception as e:
            messages.error(request, str(e))
            return redirect('register')

    return render(request, 'register.html')  # Render the registration page
