from django.contrib import admin
from django.urls import path, include  # Include the 'include' function

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('transaction.urls')),  # Include transaction app URLs
    path('oauth/', include('social_django.urls', namespace='social')),  # Add this line for social authentication
]
