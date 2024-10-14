from django.urls import path
from . import views  # Import your views here

urlpatterns = [
    path('', views.index, name='index'),  # Example route; replace with your actual view
    # Add more paths here for other views as needed
]
