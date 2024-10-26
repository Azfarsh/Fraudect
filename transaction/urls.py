# transaction/urls.py

from django.urls import path
from . import views
from django.contrib.auth import views as auth_views  # Add this import for auth views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),  # Add this line for logout
    path('register/', views.register, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('about/', views.about, name='about'),
    path('alerts/', views.alerts, name='alerts'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('confirm-otp/<uidb64>/', views.confirm_otp, name='confirm_otp'),
   # path('reset/<uidb64>/<token>/', views.CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
     path('sms/', views.sms_webhook, name='sms_webhook'),
]

