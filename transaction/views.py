from django.shortcuts import render

def index(request):
    return render(request, 'transaction/index.html')  # Adjust the template path as necessary

from django.shortcuts import render, get_object_or_404, redirect
from .models import UserDetails
from django.http import HttpResponse


# View to create a new user
def create_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        serial_no = request.POST.get('serial_no')

        new_user = UserDetails(
            username=username,
            phone=phone,
            email=email,
            serial_no=serial_no
        )
        new_user.save()  # Save the new user to the database

        return redirect('user_list')  # Redirect to the user list page after saving

    return render(request, 'create_user.html')  # Display the form for creating a new user
